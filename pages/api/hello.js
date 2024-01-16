async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const rawBody = buf.toString("utf8");

    await fetch(`https://webhook.site/3ed94c56-19ee-42d0-b952-9cbba695c3b2`, {
      method: "POST",
      body: JSON.stringify({
        body: rawBody,
        headers: req.headers,
        query: req.query,
      }),
    });

    res.json({ rawBody });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
