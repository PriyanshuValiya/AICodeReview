// const AST_PUBLIC_DNS = process.env.AST_PUBLIC_DNS || "http://43.204.109.46:4000/parse";

export async function parseWithASTService(code: string, extension: string) {
  const res = await fetch(`http://43.204.109.46:4000/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, extension }),
  });

  if (!res.ok) {
    throw new Error("AST service failed");
  } else {
    console.log(res);
  }
  
  return res.json();
}
