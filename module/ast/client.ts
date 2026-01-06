const AST_PUBLIC_DNS = process.env.AST_PUBLIC_DNS!;

export async function parseWithASTService(code: string, extension: string) {
  const res = await fetch(AST_PUBLIC_DNS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, extension }),
  });

  if (!res.ok) {
    throw new Error("AST service failed");
  } 
  
  return res.json();
}
