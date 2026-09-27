import { GoogleGenAI } from '@google/genai';
import { ToneType, EventCampaign } from '../types';

export interface GenerationParams {
  event: EventCampaign;
  highlights: string;
  tone: ToneType;
  speakerName?: string;
  speakerRole?: string;
  variationType?: 'default' | 'punchy' | 'bullet-heavy' | 'story' | 'short';
}

export async function generateLinkedInPost(params: GenerationParams): Promise<string> {
  const { event, highlights, tone, speakerRole, variationType = 'default' } = params;

  const apiKey = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
You are an expert LinkedIn ghostwriter for tech executives, engineers, founders, and conference attendees.
Generate a polished, viral, high-converting LinkedIn post based on the following details:

Event Name: ${event.name}
Organizer / Host: ${event.hostOrg}
Attendee Role / Context: ${speakerRole || 'Tech leader / attendee'}
Attendee's Raw Reflections / Highlights: ${highlights || 'Attended insightful keynotes and network sessions on enterprise scale and AI.'}
Tone: ${tone} (Options: professional, grateful, takeaways, casual)
Style Preference: ${variationType}
Official Hashtags to include at bottom: ${event.hashtags.join(' ')}

Formatting Guidelines:
- Compelling hook line with an emoji.
- Clean spacing between paragraphs for high readability on LinkedIn feeds.
- Include 2-3 structured bullet points using "🔹 " or clear bolded headings if summarizing insights.
- Enthusiastic acknowledgement or shoutout to "${event.hostOrg}".
- End with 3-5 official campaign hashtags: ${event.hashtags.join(' ')}.
- Do NOT include quotes around the entire post. Do not output conversational filler. Just the LinkedIn post text.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response.text && response.text.trim().length > 50) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, using fallback generator:', err);
    }
  }

  // High-converting algorithmic templates based on tone & variation
  return getTemplateBasedPost(params);
}

function getTemplateBasedPost(params: GenerationParams): string {
  const { event, highlights, tone, variationType = 'default' } = params;
  const tags = event.hashtags.join(' ');
  const host = event.hostOrg;
  const eventName = event.name;

  const cleanHighlights = highlights.trim()
    ? highlights.trim()
    : "Blown away by today's keynote on autonomous agent architectures and large-scale vector search! Great catching up with leaders across cloud infrastructure. Huge kudos to the organizers.";

  if (tone === 'grateful') {
    return `Incredible experience so far at ${eventName}! 🙏

Taking a moment to reflect on what an inspiring gathering of engineers, founders, and practitioners this has been.

A few standout moments:
🔹 ${cleanHighlights}
🔹 The collaborative spirit and candid discussions around real-world deployment challenges.
🔹 Meeting so many peers pushing the boundaries of what's possible in cloud and AI systems.

A huge thank you to **${host}** and the entire organizing team for putting together such a world-class experience. Leaving with full notebooks and renewed energy!

${tags}`;
  }

  if (tone === 'takeaways') {
    return `Top 3 takeaways from Day 2 at ${eventName} 💡

The industry is evolving faster than ever. Here is what's truly resonating on the ground:

🔹 **Production-Grade Velocity**: ${cleanHighlights}
🔹 **Infrastructure Modernization**: Moving from proof-of-concept experiments into hardened, secure distributed architectures.
🔹 **Ecosystem Synergy**: The gap between platform engineering and foundation model development is closing rapidly.

Outstanding execution by **${host}**. Who else is here in San Francisco? Would love to connect before closing sessions!

${tags}`;
  }

  if (tone === 'casual') {
    return `What a day at ${eventName}! 🔥

Energy in the keynote hall has been off the charts. If you're building in this space, this was definitely the room to be in today.

Quick summary of what caught my attention:
⚡ ${cleanHighlights}
⚡ Incredible impromptu hallway conversations with fellow builders
⚡ The live demos proved the future is already here

Big cheers to **${host}** for pulling off such a seamless summit.

Drop a comment or DM if you're roaming the floor—let's grab a coffee! ☕

${tags}`;
  }

  // Default: Professional tone
  if (variationType === 'punchy') {
    return `Day 2 at ${eventName} delivered on every front. 🚀

Key takeaway:
${cleanHighlights}

When platform builders and AI practitioners collaborate at this depth, enterprise workflows transform overnight.

Kudos to **${host}** for setting the gold standard in technical discourse.

${tags}`;
  }

  if (variationType === 'short') {
    return `Still thinking about today's sessions at ${eventName}.

"${cleanHighlights}"

Tremendous insights, visionary roadmap, and great conversations. Thank you **${host}**!

${tags}`;
  }

  return `Still processing the incredible energy from Day 2 at the ${eventName}! 🚀

Huge takeaways on how autonomous agents are transforming enterprise infrastructure. Key highlights:

🔹 **Real-time vector indexing at hyperscale** is no longer experimental—it's production ready.
🔹 **${cleanHighlights}**
🔹 The cross-pollination between distributed infrastructure and foundation model teams is reaching unprecedented velocity.

Special shoutout to **${host}** for hosting such a stellar lineup of innovators and visionaries. Grateful for all the insightful conversations!

${tags}`;
}
