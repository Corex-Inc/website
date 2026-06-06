export default function TermsOfService() {
  return (
    <>
      <div className="text-xs text-gray-500 mb-8">
        <p>Effective date: June 7, 2026</p>
      </div>

      <div className="space-y-8 text-sm text-gray-400 leading-relaxed">

        <section>
          <h2 className="text-base font-semibold text-white mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Corex software, documentation, website (corexinc.dev), and any related backend services or APIs (collectively, the <span className="text-gray-300 font-medium">"Services"</span>), you agree to be bound by these Terms of Service (<span className="text-gray-300 font-medium">"Terms"</span>). If you do not agree to all of these Terms, you must not access or use the Services.
          </p>
          <p className="mt-3">
            These Terms constitute a legally binding agreement between you (<span className="text-gray-300 font-medium">"User"</span>, <span className="text-gray-300 font-medium">"you"</span>, or <span className="text-gray-300 font-medium">"your"</span>) and the independent developer group known as the Corex Team (<span className="text-gray-300 font-medium">"Corex"</span>, <span className="text-gray-300 font-medium">"we"</span>, <span className="text-gray-300 font-medium">"us"</span>, or <span className="text-gray-300 font-medium">"our"</span>). We reserve the right to update these Terms at any time in accordance with Section 12.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">2. Eligibility</h2>
          <p>
            You must be at least 13 years of age (or the minimum age of digital consent in your country, e.g., 16 in certain EU member states) to use the Services. If you are under 18 years of age, you represent that your legal guardian has reviewed and agrees to these Terms on your behalf.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">3. License Grants and Open Source</h2>
          <p>
            The Corex project consists of both open-source components and proprietary backend services. Your rights are granted as follows:
          </p>
          <ul className="mt-3 space-y-2 ml-4">
            <li><span className="text-gray-300 font-medium">• Open-Source Software:</span> The Corex Minecraft plugin and the open-source portions of the website are distributed under the MIT License. Your use, modification, and distribution of these open-source components are governed entirely by the terms of the MIT License.</li>
            <li><span className="text-gray-300 font-medium">• Proprietary Online Services:</span> Access to our closed-source backend infrastructure (including API endpoints, trace data processors, and OAuth integrations) is not covered by the MIT License. Subject to your compliance with these Terms, Corex grants you a limited, non-exclusive, non-transferable, revocable right to connect to and use these Online Services solely via the official Corex plugin or website.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">4. User Conduct</h2>
          <p>When using the Services (especially our backend infrastructure), you agree not to:</p>
          <ul className="mt-3 space-y-2 ml-4">
            <li>• Use the Services for any unlawful purpose;</li>
            <li>• Attempt to reverse-engineer, decompile, or extract the source code of our closed-source backend systems;</li>
            <li>• Interfere with or disrupt the integrity or performance of the Online Services;</li>
            <li>• Transmit any malicious code or exploit vulnerabilities within our APIs;</li>
            <li>• Use automated means (bots, scrapers) to abuse our API in a manner that exceeds reasonable request volumes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">5. Privacy and Data Collection</h2>
          <p>
            We process certain technical and account information to provide you with the Services. By logging in via third-party providers (such as Discord or Microsoft OAuth) or utilizing features like the <code className="bg-gray-800 text-gray-200 px-1 py-0.5 rounded">/corex trace</code> command and bStats telemetry, you acknowledge that data will be processed in accordance with our <a href="/documents/privacy" className="text-white hover:underline">Privacy Policy</a>.
          </p>
          <p className="mt-3">
            If you run a Minecraft server and transmit server data to our backend, you are solely responsible for obtaining any necessary consent from your own players.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">6. Intellectual Property</h2>
          <p>
            The Corex name, branding, logos, and website design are the property of the Corex Team. The open-source code remains licensed under the MIT License. Our proprietary backend code and infrastructure remain the exclusive property of the Corex Team.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">7. User-Generated Content</h2>
          <p>
            You retain ownership of any scripts, configurations, and other content you create using the Services (<span className="text-gray-300 font-medium">"User Content"</span>). By voluntarily submitting or sharing User Content through our platforms (e.g., Discord), you grant Corex a non-exclusive, worldwide, royalty-free license to use and display such content to improve the Services.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">8. Voluntary Donations</h2>
          <p>
            All core Services are provided free of charge. We may provide links to third-party platforms (e.g., Boosty) for voluntary financial support. Any funds sent to the Corex Team are considered voluntary donations. They do not constitute a purchase of goods, services, or premium privileges, and are strictly non-refundable.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">9. Disclaimer of Warranties</h2>
          <p>
            THE SERVICES ARE PROVIDED <span className="text-gray-300 font-medium">"AS IS"</span> AND <span className="text-gray-300 font-medium">"AS AVAILABLE"</span> WITHOUT WARRANTIES OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. WE DO NOT GUARANTEE THAT THE SERVICES WILL BE ERROR-FREE, SECURE, OR UNINTERRUPTED.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">10. Limitation of Liability</h2>
          <p>
            BECAUSE THE SERVICES ARE PROVIDED FREE OF CHARGE, TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE COREX TEAM BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF DATA, SERVER CORRUPTION, OR LOSS OF PROFITS) ARISING OUT OF YOUR USE OF THE SERVICES.
          </p>
          <p className="mt-3">
            IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE AMOUNT YOU HAVE PAID TO US IN THE PAST TWELVE (12) MONTHS (WHICH IS TYPICALLY €0.00).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless the Corex Team from any claims, damages, or expenses (including attorneys' fees) arising out of your misuse of the Services, your violation of these Terms, or your violation of any third-party rights.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">12. Modifications</h2>
          <p>
            We may revise these Terms at any time. Material changes will be communicated via our website or Discord server. Your continued use of the Services after the effective date of a revision constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">13. Governing Law and Dispute Resolution</h2>
          <p>
            As a free project managed by an independent team, any disputes arising from these Terms shall be resolved amicably through good-faith communication. These Terms are governed by general principles of consumer law. Nothing in these Terms shall deprive you of mandatory consumer protections under your local laws.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">14. Contact</h2>
          <p>If you have any questions or concerns regarding these Terms, please contact us via:</p>
          <ul className="mt-3 space-y-1 ml-4">
            <li>• Discord Server: <a href="https://dsc.gg/corexinc" className="text-white hover:underline">https://dsc.gg/corexinc</a></li>
          </ul>
        </section>

      </div>
    </>
  );
}