import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize YOUMI AI SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY environment variable is not defined.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'youmi-builder',
      },
    },
  });
};

// API Endpoint for AI Builder (prompt-to-template generation)
app.post('/api/ai/generate', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { prompt, language } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const ai = getGeminiClient();
    const systemInstruction = `You are an expert ecommerce web designer specializing in Arabic and Algerian marketplaces.
Generate a beautiful, customized JSON configuration for the 'YOUMI Builder' matching the user's brand description.

The generated JSON MUST strictly match this TypeScript schema:
interface ProjectConfig {
  siteInfo: {
    siteName: string;
    description: string;
    logoUrl: string;
    contactEmail: string;
    contactPhone: string;
    currency: string; // e.g. "DZD" or "USD"
    supportHours: string;
    activeTaxRate: number;
  };
  header: {
    layoutStyle: 'minimal' | 'centered' | 'fullwidth';
    showSearchBar: boolean;
    searchPlaceholder: string;
    cartIconStyle: 'bag' | 'cart';
    showNotificationBanner: boolean;
    notificationText: string;
    notificationLink: string;
  };
  menu: {
    items: Array<{ id: string; label: string; url: string; isFeatured: boolean; badgeText?: string }>;
  };
  hero: {
    autoPlay: boolean;
    slideInterval: number;
    slides: Array<{ id: string; title: string; subtitle: string; imageUrl: string; buttonText: string; buttonUrl: string; badgeText?: string }>;
  };
  categories: {
    sectionTitle: string;
    sectionSubtitle: string;
    categories: Array<{ id: string; name: string; imageUrl: string; itemCount: number; isActive: boolean; icon: string }>;
    products: Array<{ id: string; name: string; price: number; originalPrice?: number; category: string; imageUrl: string; rating: number; isFeatured: boolean; isNew?: boolean }>;
  };
  footer: {
    copyrightText: string;
    showSocialLinks: boolean;
    socialLinks: { facebook: string; instagram: string; twitter: string; linkedin: string };
    columns: Array<{ id: string; title: string; links: Array<{ label: string; url: string }> }>;
  };
  colors: {
    primary: string; // Hex color code
    secondary: string; // Hex color code
    accent: string; // Hex color code
    background: string; // Hex color code
    text: string; // Hex color code
    headerBg: string; // Hex color code
    footerBg: string; // Hex color code
  };
  fonts: {
    headingFont: 'Cairo' | 'Inter' | 'Space Grotesk' | 'Playfair Display' | 'Outfit' | 'Plus Jakarta Sans';
    bodyFont: 'Cairo' | 'Inter' | 'Roboto' | 'Plus Jakarta Sans' | 'Lora';
    fontSizeBase: 'small' | 'medium' | 'large';
  };
  buttons: {
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    buttonPadding: 'compact' | 'normal' | 'spacious';
    buttonShadow: 'none' | 'sm' | 'md' | 'lg';
    hoverEffect: 'none' | 'scale' | 'fade';
  };
}

Rules:
1. Always generate real, descriptive content in Arabic (or English if requested). Default to Arabic as this is YOUMI Algeria.
2. Output a beautiful, consistent color scheme with modern, elegant hex codes.
3. For categories and images, use actual premium unsplash URLs related to the store theme (e.g., fashion, tech, groceries, perfume, car parts, jewelry, etc.).
4. Do NOT include any markdown code blocks, explanatory text, or trailing characters. Output ONLY the raw valid JSON.`;

    const userPrompt = `Generate a customized store configuration for a: "${prompt}". Language requested: ${language || 'Arabic'}. Ensure beautiful matching colors, authentic local product names (e.g. for phones, clothes, services), prices in Algerian Dinars (DZD) or local currency, and stylish layout variables.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('No content returned from AI service');
    }

    const configData = JSON.parse(textOutput.trim());
    res.json({ config: configData });
  } catch (error: any) {
    console.error('❌ Error generating AI template:', error);
    res.status(500).json({ error: error.message || 'Failed to generate AI template' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT} [ENV: ${process.env.NODE_ENV || 'development'}]`);
  });
}

startServer();
