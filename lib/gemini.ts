import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set. AI features will not work.");
}

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Retry helper function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check for quota exceeded (daily limit) - don't retry, show error immediately
      if (error.message?.includes("quota") || error.message?.includes("Quota exceeded")) {
        throw new Error(
          "Daily API quota exceeded. You've reached the free tier limit (20 requests/day). " +
          "Please try again tomorrow or upgrade your Google AI Studio plan. " +
          "Visit https://ai.dev/usage to check your usage."
        );
      }
      
      // Check if it's a retryable error (503, 429 rate limit, or network errors)
      const isRetryable = 
        error.message?.includes("503") ||
        error.message?.includes("Service Unavailable") ||
        (error.message?.includes("429") && !error.message?.includes("quota")) ||
        error.message?.includes("overloaded") ||
        (error.message?.includes("rate limit") && !error.message?.includes("quota"));
      
      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }
      
      // For 429 rate limits, use longer delays
      const isRateLimit = error.message?.includes("429");
      const delay = isRateLimit 
        ? Math.max(initialDelay * Math.pow(2, attempt), 5000) // At least 5 seconds for rate limits
        : initialDelay * Math.pow(2, attempt);
      
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export async function generateAICaption(
  model: string,
  condition: string,
  storage?: string,
  variant?: string,
  ram?: string,
  template?: string
): Promise<string> {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured. Please set it in your .env file.");
  }

  try {
    // Use the latest model (gemini-2.5-flash)
    const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Replace placeholders in template with actual values
    let processedTemplate = template;
    if (template) {
      processedTemplate = template
        .replace(/{model}/g, model)
        .replace(/{condition}/g, condition)
        .replace(/{storage}/g, storage || "")
        .replace(/{ram}/g, ram || "")
        .replace(/{variant}/g, variant || "");
    }
    
    const templateSection = processedTemplate
      ? `\n\nIMPORTANT: Follow this exact style and format template:\n${processedTemplate}\n\nUse this template as a guide for structure, tone, and formatting.`
      : "";

    const prompt = `Generate a Facebook Marketplace caption for a phone listing. Write it as if you are the seller posting directly - no introductory phrases, no explanations, just the listing itself.

Phone Details:
- Model: ${model}
- Condition: ${condition}
${storage ? `- Storage: ${storage}` : ""}
${ram ? `- RAM: ${ram}` : ""}
${variant ? `- Color/Variant: ${variant}` : ""}
${templateSection}

CRITICAL REQUIREMENTS:
1. Start directly with the phone information - NO introductory phrases like "Here's a caption", "Here's a compelling listing", "Here's your caption", or any similar phrases
2. Use plain text only - NO markdown formatting (no **, no *, no bold, no italics, no markdown of any kind)
3. Write naturally as a human seller would post on Facebook Marketplace
4. Format appropriately for a marketplace listing
5. Mention any issues honestly
6. Include relevant hashtags naturally at the end
7. Keep it concise but informative
${template ? "8. Follow the provided template style and format exactly, replacing placeholders with actual values" : "8. Use your own natural format for marketplace listings"}

Generate ONLY the caption text, nothing else - no explanations, no introductions:`;

    const result = await retryWithBackoff(async () => {
      return await aiModel.generateContent(prompt);
    });
    const response = await result.response;
    let caption = response.text();
    
    // Clean up the response: remove introductory phrases and markdown
    // Remove common AI introductory phrases
    const introPhrases = [
      /^Here's a compelling Facebook Marketplace caption[:\s]*/i,
      /^Here's a caption[:\s]*/i,
      /^Here's your caption[:\s]*/i,
      /^Here is a compelling[:\s]*/i,
      /^Here is your[:\s]*/i,
      /^Here's the caption[:\s]*/i,
      /^Here's the listing[:\s]*/i,
      /^Here's a Facebook Marketplace listing[:\s]*/i,
      /^Here's a listing[:\s]*/i,
    ];
    
    for (const phrase of introPhrases) {
      caption = caption.replace(phrase, "").trim();
    }
    
    // Remove markdown formatting
    caption = caption
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold **text**
      .replace(/\*(.*?)\*/g, "$1") // Remove italic *text*
      .replace(/__(.*?)__/g, "$1") // Remove bold __text__
      .replace(/_(.*?)_/g, "$1") // Remove italic _text_
      .replace(/~~(.*?)~~/g, "$1") // Remove strikethrough
      .replace(/`(.*?)`/g, "$1") // Remove code formatting
      .replace(/^#{1,6}\s+/gm, "") // Remove markdown headers
      .replace(/^\s*[-*+]\s+/gm, "") // Remove markdown list markers (but keep content)
      .replace(/^\s*\d+\.\s+/gm, "") // Remove numbered list markers
      .trim();
    
    return caption;
  } catch (error: any) {
    console.error("Error generating caption:", error);
    
    // Provide user-friendly error messages
    if (error.message?.includes("quota") || error.message?.includes("Quota exceeded")) {
      throw new Error(
        "Daily API quota exceeded. You've reached the free tier limit (20 requests/day). " +
        "Please try again tomorrow or upgrade your Google AI Studio plan at https://ai.dev/usage"
      );
    }
    
    throw new Error(
      error.message || "Failed to generate caption. Please check your GEMINI_API_KEY."
    );
  }
}

export async function generateAITags(
  model: string,
  storage?: string,
  variant?: string
): Promise<string[]> {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured. Please set it in your .env file.");
  }

  try {
    const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate search tags (keywords) for a phone listing on Facebook Marketplace. These are search terms people would use to find this phone.

Phone Details:
- Model: ${model}
${storage ? `- Storage: ${storage}` : ""}
${variant ? `- Color/Variant: ${variant}` : ""}

Generate 15-20 relevant search tags as comma-separated keywords. Include:
- Brand name (e.g., samsung, apple, iphone)
- Model name broken down (e.g., s22, ultra, pro, max)
- Storage size (e.g., 256gb, 128gb)
- Color/variant if applicable
- General terms (e.g., android, cellphone, phone, smartphone, mobile)
- Condition-related terms if applicable

Return ONLY a comma-separated list of keywords, no hashtags, no extra text. Example: samsung,s22,ultra,android,cellphone,phone,256gb,black,smartphone`;

    const result = await retryWithBackoff(async () => {
      return await aiModel.generateContent(prompt);
    });
    const response = await result.response;
    const text = response.text().trim();
    
    // Extract comma-separated tags
    const tags = text
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);
    
    return tags;
  } catch (error: any) {
    console.error("Error generating tags:", error);
    
    if (error.message?.includes("quota") || error.message?.includes("Quota exceeded")) {
      throw new Error(
        "Daily API quota exceeded. You've reached the free tier limit (20 requests/day). " +
        "Please try again tomorrow or upgrade your Google AI Studio plan at https://ai.dev/usage"
      );
    }
    
    throw new Error(
      error.message || "Failed to generate tags. Please check your GEMINI_API_KEY."
    );
  }
}

export async function suggestPrice(
  model: string,
  storage: string,
  condition: string,
  pastSales?: Array<{ sellingPrice: number; condition: string }>,
  marketplaceRange?: { min: number; max: number }
): Promise<{
  suggested: number;
  rush: number;
  safe: number;
  high: number;
}> {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured. Please set it in your .env file.");
  }

  try {
    const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const pastSalesContext = pastSales && pastSales.length > 0
    ? `\nPast Sales Data:\n${pastSales.map((s) => `- ${s.condition}: ₱${s.sellingPrice.toLocaleString()}`).join("\n")}`
    : "";

  const marketplaceContext = marketplaceRange
    ? `\nCurrent Marketplace Price Range:\n- Minimum: ₱${marketplaceRange.min.toLocaleString()}\n- Maximum: ₱${marketplaceRange.max.toLocaleString()}\n\nIMPORTANT: Your price suggestions MUST be within this marketplace range. Do not suggest prices outside this range.`
    : "";

  const prompt = `Suggest accurate pricing for a phone listing based on current marketplace prices.

Phone Details:
- Model: ${model}
- Storage: ${storage}
- Condition: ${condition}
${pastSalesContext}
${marketplaceContext}

${marketplaceRange ? "CRITICAL: All price suggestions MUST be realistic and within the marketplace range provided above. Base your suggestions on actual market prices, not inflated estimates." : ""}

Provide 4 price suggestions in PHP (Philippine Peso):
1. Suggested Price (balanced, competitive market price)
2. Rush Price (quick sale, 5-10% below suggested)
3. Safe Price (conservative, guaranteed interest, slightly below suggested)
4. High Price (patient buyers, maximum reasonable price, within marketplace range)

${marketplaceRange ? `All prices must be between ₱${marketplaceRange.min.toLocaleString()} and ₱${marketplaceRange.max.toLocaleString()}.` : ""}

Return ONLY a JSON object with these exact keys: suggested, rush, safe, high
Example: {"suggested": 25000, "rush": 23000, "safe": 24000, "high": 27000}`;

    const result = await retryWithBackoff(async () => {
      return await aiModel.generateContent(prompt);
    });
    const response = await result.response;
    const text = response.text().trim();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback prices
    return {
      suggested: 20000,
      rush: 18000,
      safe: 19000,
      high: 22000,
    };
  } catch (error: any) {
    console.error("Error suggesting price:", error);
    
    if (error.message?.includes("quota") || error.message?.includes("Quota exceeded")) {
      throw new Error(
        "Daily API quota exceeded. You've reached the free tier limit (20 requests/day). " +
        "Please try again tomorrow or upgrade your Google AI Studio plan at https://ai.dev/usage"
      );
    }
    
    throw new Error(
      error.message || "Failed to suggest price. Please check your GEMINI_API_KEY."
    );
  }
}

export async function autoFillPhoneInfo(model: string): Promise<{
  storageOptions: string[];
  colorVariants: string[];
  commonIssues: string[];
  typicalPriceRange: { min: number; max: number };
  conditionSuggestions: string[];
}> {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured. Please set it in your .env file.");
  }

  try {
    const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Provide comprehensive auto-fill information for a phone model based on real-world marketplace data.

Model: ${model}

Return a JSON object with:
- storageOptions: array of ALL available storage sizes for this model (e.g., ["64GB", "128GB", "256GB", "512GB", "1TB"])
- colorVariants: array of ALL available colors/variants for this model (e.g., ["Black", "White", "Blue", "Purple", "Red"])
- commonIssues: array of typical issues/problems for this specific model based on real user reports (e.g., ["Green lines", "Battery drain", "Screen burn", "Overheating", "Camera issues"])
- conditionSuggestions: array of common condition descriptions used in marketplace (e.g., ["Mint", "Good", "Fair", "Green lines", "Minor scratches", "Screen burn"])
- typicalPriceRange: object with realistic min and max prices in PHP (Philippine Peso) based on current marketplace prices for this model

Be specific to this exact model. Research what storage options, colors, and common issues are actually associated with ${model}.

Return ONLY valid JSON, no additional text:`;

    const result = await retryWithBackoff(async () => {
      return await aiModel.generateContent(prompt);
    });
    const response = await result.response;
    const text = response.text().trim();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Ensure all required fields exist
      return {
        storageOptions: parsed.storageOptions || ["64GB", "128GB", "256GB", "512GB"],
        colorVariants: parsed.colorVariants || ["Black", "White", "Blue"],
        commonIssues: parsed.commonIssues || ["Normal wear", "Minor scratches"],
        conditionSuggestions: parsed.conditionSuggestions || ["Mint", "Good", "Fair"],
        typicalPriceRange: parsed.typicalPriceRange || { min: 15000, max: 30000 },
      };
    }
    
    // Fallback
    return {
      storageOptions: ["64GB", "128GB", "256GB", "512GB"],
      colorVariants: ["Black", "White", "Blue"],
      commonIssues: ["Normal wear", "Minor scratches"],
      conditionSuggestions: ["Mint", "Good", "Fair"],
      typicalPriceRange: { min: 15000, max: 30000 },
    };
  } catch (error: any) {
    console.error("Error auto-filling phone info:", error);
    
    if (error.message?.includes("quota") || error.message?.includes("Quota exceeded")) {
      throw new Error(
        "Daily API quota exceeded. You've reached the free tier limit (20 requests/day). " +
        "Please try again tomorrow or upgrade your Google AI Studio plan at https://ai.dev/usage"
      );
    }
    
    throw new Error(
      error.message || "Failed to auto-fill phone info. Please check your GEMINI_API_KEY."
    );
  }
}

