const EC2_PUBLICIP = process.env.EC2_PUBLICIP!;

export async function parseWithASTService(code: string, extension: string) {
  console.log("Waiting for EC2 instance's response", EC2_PUBLICIP);
  console.log("➡️ Calling AST service on for", EC2_PUBLICIP, extension);

  const res = await fetch(`http://13.127.220.0:4000/parse`, {
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
