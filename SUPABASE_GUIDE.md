# Pharmelo API & Automation Guide

This project uses Supabase Edge Functions to handle backend automation (Weekly Emails).

## Folder Structure
The API code is located at:
`supabase/functions/send-weekly-update/index.ts`

## How to Edit
1. Make changes to `index.ts`.
2. Open Terminal.
3. Run: `supabase functions deploy send-weekly-update`

## Secrets Required
For the API to work, you must set these secrets in your Supabase Dashboard or via CLI:

1. `API_KEY`: Your Google Gemini API Key.
2. `RESEND_API_KEY`: Your key from Resend.com (for sending emails).

## Testing
You can test the function from the **Admin Dashboard > Campaigns** tab by clicking "Test Trigger Now".
