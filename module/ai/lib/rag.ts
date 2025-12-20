import { pineconeIndex } from "@/lib/pinecone";
import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { parseWithASTService } from "@/module/ast/client";
import type { PineconeRecord } from "@pinecone-database/pinecone";
import type { CodeMetadata } from "@/types/ast/type";

export async function generateEmbedding(text: string) {
  const { embedding } = await embed({
    model: google.textEmbeddingModel("text-embedding-004"),
    value: text,
  });

  return embedding;
}

export async function indexCodebase(
  repoId: string,
  files: { path: string; content: string }[]
) {
  console.log("🚀 indexCodebase started for", repoId);
  const vectors: PineconeRecord<CodeMetadata>[] = [];

  for (const file of files) {
    console.log("📄 Processing file:", file.path);
    const ext = file.path.split(".").pop();
    if (!ext || !["js", "ts", "jsx", "tsx"].includes(ext)) {
      continue;
    }

    let symbols: {
      type: "function" | "class";
      name: string;
      code: string;
      startLine: number;
      endLine: number;
    }[] = [];

    try {
      const result = await parseWithASTService(file.content, ext);
      symbols = result.symbols;
    } catch (error) {
      console.error("AST service failed for:", file.path, error);
    }

    console.log("Symbol Size: ", symbols.length);

    if (symbols.length === 0) {
      const embedding = await generateEmbedding(file.content.slice(0, 8000));

      vectors.push({
        id: `${repoId}-${file.path.replace(/\//g, "_")}`,
        values: embedding,
        metadata: {
          repoId,
          path: file.path,
          type: "file",
        },
      });

      continue;
    }

    for (const symbol of symbols) {
      const embedding = await generateEmbedding(symbol.code.slice(0, 2000));

      vectors.push({
        id: `${repoId}-${file.path.replace(/\//g, "_")}-${symbol.name}`,
        values: embedding,
        metadata: {
          repoId,
          path: file.path,
          type: "symbol",
          symbolName: symbol.name,
          symbolType: symbol.type,
          startLine: symbol.startLine,
          endLine: symbol.endLine,
        },
      });
    }
  }

  const batchSize = 100;

  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    await pineconeIndex.upsert(batch);
  }

  console.log(`Indexing completed: ${vectors.length} vectors`);
}

export async function retrieveContext(
  query: string,
  repoId: string,
  topK: number = 5
) {
  const embedding = await generateEmbedding(query);

  const results = await pineconeIndex.query({
    vector: embedding,
    filter: { repoId, type: "symbol" },
    topK,
    includeMetadata: true,
  });

  return results.matches.map((match) => match.metadata).filter(Boolean);
}
