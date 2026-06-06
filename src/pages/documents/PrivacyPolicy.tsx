export default function PrivacyPolicy() {
  return (
    <>
      <div className="text-xs text-gray-500 mb-8">
        <p>Effective date: June 7, 2026</p>
      </div>

      <div className="space-y-8 text-sm text-gray-400 leading-relaxed">

        <section>
          <h2 className="text-base font-semibold text-white mb-3">1. Introduction</h2>
          <p>
            The Corex Team (<span className="text-gray-300 font-medium">"Corex"</span>, <span className="text-gray-300 font-medium">"we"</span>, <span className="text-gray-300 font-medium">"us"</span>, <span className="text-gray-300 font-medium">"our"</span>) is committed to protecting your privacy. We aim to align our practices with the principles of the General Data Protection Regulation (EU) 2016/679 (<span className="text-gray-300 font-medium">"GDPR"</span>) and applicable privacy laws.
          </p>
          <p className="mt-3">
            This Privacy Policy describes how we collect, use, and safeguard your personal data when you use the Corex software, website (corexinc.dev), and related backend services (collectively, the <span className="text-gray-300 font-medium">"Services"</span>).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">2. Data Controller</h2>
          <p>
            As an independent, open-source developer team, the data controller responsible for your personal data is the Corex Team.
          </p>
          <ul className="mt-3 space-y-1 ml-4">
            <li>• Contact Discord server: <a href="https://dsc.gg/corexinc" className="text-white hover:underline">https://dsc.gg/corexinc</a></li>
          </ul>
          <p className="mt-3">
            If you have questions about data processing or wish to exercise your rights, please contact us at the email address above.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">3. Data We Collect</h2>

          <h3 className="text-gray-300 font-semibold mt-4 mb-2">3.1 Account & Authentication Data</h3>
          <ul className="space-y-1 ml-4">
            <li>• When you log in via OAuth providers (Discord, Microsoft), we collect your public profile identifiers, username, avatar, and email address (if provided by the platform).</li>
          </ul>

          <h3 className="text-gray-300 font-semibold mt-4 mb-2">3.2 Server Telemetry and Traces (Minecraft Plugin)</h3>
          <ul className="space-y-1 ml-4">
            <li>• <span className="text-gray-300 font-medium">bStats:</span> We may use bStats to collect anonymous, aggregated statistics about plugin usage (e.g., server version, player count).</li>
            <li>• <span className="text-gray-300 font-medium">Trace Data:</span> If you explicitly activate the <code className="bg-gray-800 text-gray-200 px-1 py-0.5 rounded">/corex trace</code> command, your server will transmit performance data to our backend. <strong>Important:</strong> If this trace data inadvertently includes IP addresses or usernames of your players, you (the server administrator) act as the Data Controller for your players, and Corex acts solely as a Data Processor. You are responsible for obtaining your players' consent.</li>
          </ul>

          <h3 className="text-gray-300 font-semibold mt-4 mb-2">3.3 Data Collected Automatically</h3>
          <ul className="space-y-1 ml-4">
            <li>• <span className="text-gray-300 font-medium">Technical data:</span> IP address, browser type, and basic usage logs to ensure the security and stability of our website and API.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">4. Legal Basis for Processing</h2>
          <p>We process your data based on the following principles (aligned with Art. 6 GDPR):</p>
          <ul className="mt-3 space-y-2 ml-4">
            <li><span className="text-gray-300 font-medium">• Contractual necessity:</span> To provide you with account access and functionality (e.g., OAuth login).</li>
            <li><span className="text-gray-300 font-medium">• Legitimate interests:</span> To monitor server performance, prevent API abuse, and improve our open-source software.</li>
            <li><span className="text-gray-300 font-medium">• Consent:</span> For explicit actions like manually initiating a server trace.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">5. Cookies and Tracking</h2>
          <p>
            We use strictly necessary (essential) cookies to manage user sessions and authentication states (e.g., keeping you logged in). Because these cookies are required for the website to function, they do not require prior consent under the ePrivacy Directive. We do not use intrusive third-party tracking or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">6. Data Retention</h2>
          <p>We retain your personal data only for as long as necessary:</p>
          <ul className="mt-3 space-y-2 ml-4">
            <li><span className="text-gray-300 font-medium">• Account data:</span> Retained until you request account deletion.</li>
            <li><span className="text-gray-300 font-medium">• Trace & Telemetry data:</span> Retained temporarily for processing and debugging, then routinely anonymized or deleted.</li>
            <li><span className="text-gray-300 font-medium">• Server logs:</span> IP addresses and access logs are typically kept for a short period (up to 90 days) for security and anti-DDoS purposes before being purged.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">7. Data Sharing and International Transfers</h2>
          <p>
            We do not sell your personal data. We only share data with service providers (such as hosting platforms) necessary to run our infrastructure.
          </p>
          <p className="mt-3">
            Because our development team and server infrastructure operate globally (including regions outside the European Economic Area), your data may be transferred outside the EU. By using our Services, you acknowledge and agree to this transfer, which is safeguarded by industry-standard encryption and security practices.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">8. Your Privacy Rights</h2>
          <p>
            If you reside in the EEA, UK, or other regions with applicable privacy laws, you have rights to:
          </p>
          <ul className="mt-3 space-y-2 ml-4">
            <li>• Access the personal data we hold about you;</li>
            <li>• Request correction of inaccurate data;</li>
            <li>• Request deletion of your data (Right to be Forgotten);</li>
            <li>• Object to or restrict our processing of your data;</li>
            <li>• Withdraw any previously given consent.</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, simply contact us at <a href="https://dsc.gg/corexinc" className="text-white hover:underline">https://dsc.gg/corexinc</a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">9. Children's Privacy</h2>
          <p>
            The Services are not directed at children under the age of digital consent (which ranges from 13 to 16 depending on your jurisdiction). We do not knowingly collect personal data from underage individuals without parental consent. If we become aware of such collection, we will delete the data promptly.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">10. Security</h2>
          <p>
            We use industry-standard measures (such as TLS encryption) to protect your data. However, no internet-based service is 100% secure. You share data with us at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy as our project evolves. Changes will be posted on this page. Your continued use of the Services after updates constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-3">12. Contact</h2>
          <p>For any privacy-related inquiries, please contact our privacy team:</p>
          <ul className="mt-3 space-y-1 ml-4">
            <li>• Discord: <a href="https://dsc.gg/corexinc" className="text-white hover:underline">https://dsc.gg/corexinc</a></li>
          </ul>
        </section>

      </div>
    </>
  );
}