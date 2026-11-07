VIKAS WEB STUDIO — SETUP GUIDE
==============================

Included pages:
- index.html       Home
- about.html       About
- services.html    Services
- portfolio.html   Portfolio (demo concepts + published projects from Supabase)
- contact.html     Enquiry form
- admin/index.html Private admin dashboard
- database/setup.sql  Run separately in Supabase SQL Editor

ALREADY CONFIGURED
- Supabase project URL and publishable key
- Formspree endpoint: https://formspree.io/f/xzeewabb
- Intended enquiry notification email: vikaspatellofficial@gmail.com (must be selected/verified in Formspree form settings)
- Supabase admin user UUID supplied: 8f43594f-2724-4140-9ebe-2038f9566229
- Small Admin Login link added at the bottom-left of every page footer
- WhatsApp: +91 79050 17138
- No public location shown
- OTP verification is skipped; mobile number is format-checked only

STEP 1 — SET UP SUPABASE DATABASE
1. Open https://supabase.com/dashboard/project/xbfyzgkqjgvnfzyhlwfd
2. Open SQL Editor.
3. Open database/setup.sql from this package.
4. Copy the SQL and run it.
5. Confirm the enquiries and projects tables exist, and the project-images storage bucket exists.

STEP 2 — CREATE THE ADMIN LOGIN
1. In Supabase Dashboard, open Authentication > Users.
2. Add/create a user with vikaspatellofficial@gmail.com and a password you choose privately.
3. Do NOT send your password in ChatGPT or put it in website files.
4. The included database/setup.sql assigns role=admin to the supplied UUID in auth.users. Run the SQL, then confirm the returned email is vikaspatellofficial@gmail.com. If the UUID belongs to a different account, stop and correct it before signing in.
5. Sign in at /admin/ after deployment. If already signed in before changing app_metadata, sign out and sign in again so the JWT refreshes.
6. Keep public sign-ups disabled. Only create admin accounts yourself.

IMPORTANT: The dashboard checks the app_metadata role in the browser and database RLS also enforces it. The SQL does not create an admin user or assign roles automatically.

STEP 3 — CHECK FORMSPREE
1. Sign in at https://formspree.io/login
2. Open the form whose endpoint is xzeewabb.
3. In form settings / email notifications, set and verify the recipient as vikaspatellofficial@gmail.com. The website endpoint alone cannot set the recipient email; Formspree controls delivery settings.
4. Complete any email verification Formspree requests.
5. Test the form after deployment. Formspree may reject requests until the form is configured/verified.

STEP 4 — DEPLOY TO NETLIFY
1. Extract the ZIP file on your computer.
2. Open https://app.netlify.com/drop
3. Drag the extracted vikas-web-studio folder (or its contents) onto the drop area.
4. Wait for Netlify to publish and give you a temporary *.netlify.app URL.
5. In Netlify Site configuration, change the site name if the desired name is available.
6. Test every page, the enquiry form, WhatsApp link and /admin/. The tiny Admin Login link is at the bottom-left of each page footer.

STEP 5 — TEST
- Submit a test enquiry with a valid email and Indian mobile number.
- Check Formspree submissions and the recipient Gmail inbox (including Spam).
- In Supabase Table Editor > enquiries, confirm the enquiry was saved.
- Sign in to /admin/ and add a test project with an image.
- Check that a published project appears on portfolio.html.

NOTES / LIMITATIONS
- This is a static front end. The public Supabase publishable key is intended for browser use; never add a service-role or secret key.
- Email notification and database submission are independent. The page reports success only if both succeed; if one fails, it tells the visitor to use WhatsApp.
- The mobile check validates the number format, not whether the number is active or belongs to the visitor. OTP was intentionally left out.
- Initial portfolio entries are clearly marked demo projects. No fabricated customer testimonials are included.
- The images used for demo concepts are remote Unsplash images and require internet access.
- Netlify deployment has NOT been performed by this package. You must complete the drag-and-drop steps, or provide access through an approved workflow, before the site is live.
