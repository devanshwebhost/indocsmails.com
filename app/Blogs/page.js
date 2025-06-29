"use client";
import React, { useState, useEffect, useRef } from 'react';

// Main App Component that acts as the blog post
const Home = () => {
    // State for the Gemini chat
    const [chatHistory, setChatHistory] = useState([]);
    const [userQuestion, setUserQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);

    // Placeholder for blog content summary to provide context to Gemini
    const blogContentSummary = `
        This blog post covers Email APIs for programmatic email sending, focusing on internal notifications,
        alerts, and documentation updates. It provides guides for sending emails from Python, Node.js, Java,
        PHP, Ruby, C#, and Go. It also discusses choosing the right API based on free tiers, deliverability,
        scalability, features like templates and analytics, security, and the difference between SMTP and REST APIs.
        Common questions covered include what transactional email is, why use APIs for internal comms,
        improving deliverability, tracking opens, sending documents, API rate limits, and template management.
        Popular APIs mentioned are SendGrid, Mailgun, Amazon SES, Brevo (Sendinblue), and Postmark.
    `;

    // Scroll to the bottom of the chat history
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // Function to call Gemini API
    const handleAskGemini = async () => {
        if (!userQuestion.trim()) return;

        const newChatHistory = [...chatHistory, { role: 'user', parts: [{ text: userQuestion }] }];
        setChatHistory(newChatHistory);
        setUserQuestion('');
        setIsLoading(true);

        const prompt = `You are an AI assistant helping a user understand Email APIs based on the following blog post summary:
        "${blogContentSummary}"

        User's question: "${userQuestion}"

        Please provide a concise and helpful answer based on the context provided, or general knowledge about email APIs if the question goes beyond the summary.`;

        try {
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            };
            const apiKey = ""; // Canvas will automatically provide the API key
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: text }] }]);
            } else {
                setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: 'Sorry, I could not get a response from Gemini. Please try again.' }] }]);
                console.error("Gemini API response structure unexpected:", result);
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: 'An error occurred while connecting to Gemini. Please try again later.' }] }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleAskGemini();
        }
    };

    return (
        <article className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8 font-sans text-gray-800 rounded-lg shadow-xl m-2">
            {/* Blog Post Header */}
            <header className="text-center mb-10 p-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-xl sm:text-4xl lg:text-5xl font-extrabold text-indigo-700 mb-4 leading-tight">
                    🚀 Learn Email APIs for Your Internal Communications & Beyond with ⚡Indocs Mails
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                    Learn how to easily send automated emails from Python, Node.js, Java & more using powerful Email APIs.
                    Discover solutions for internal notifications, alerts, and transactional mails.
                </p>
            </header>

            {/* Main Content Sections */}
            <section className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg mb-10 max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6">
                    What is an Email API and Why Do You Need One? 📧
                </h2>
                <p className="mb-4 leading-relaxed">
                    An Email API (Application Programming Interface) is a set of defined rules that allows your applications
                    to send, receive, and manage emails programmatically, without direct user intervention. Unlike traditional
                    SMTP setups, an API provides a more robust, scalable, and feature-rich way to integrate email functionality
                    directly into your software.
                </p>
                <p className="mb-4 leading-relaxed">
                    You need an Email API for automation, ensuring high deliverability, gaining valuable insights through tracking,
                    and enhancing security. It's essential for both external communications (like user sign-up confirmations or marketing campaigns)
                    and, critically, for **internal communications** such as system alerts, automated reports, and team notifications.
                </p>
            </section>

            {/* Language-Specific Guides */}
            <section className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg mb-10 max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6">
                    Sending Emails Programmatically: A Language-by-Language Guide 💻
                </h2>

                {[
                    { lang: 'Python', snippet: `import requests\n# Example using a popular Email API's SDK (e.g., SendGrid)\n# from sendgrid import SendGridAPIClient\n# from sendgrid.helpers.mail import Mail\n\n# Or using requests for a generic REST API call\n# url = "https://api.emailservice.com/send"\n# headers = {"Authorization": "Bearer YOUR_API_KEY"}\n# data = {"to": "recipient@example.com", "subject": "Hello from Python", "body": "This is a test."}\n# response = requests.post(url, headers=headers, json=data)\n# print(response.json())` },
                    { lang: 'Node.js', snippet: `const axios = require('axios');\n// Example using a popular Email API's SDK (e.g., Mailgun)\n// const mailgun = require('mailgun-js')({apiKey: 'YOUR_API_KEY', domain: 'YOUR_DOMAIN'});\n\n// Or using axios for a generic REST API call\n// async function sendEmail() {\n//   try {\n//     const response = await axios.post('https://api.emailservice.com/send', {\n//       to: 'recipient@example.com',\n//       subject: 'Hello from Node.js',\n//       body: 'This is a test.'\n//     }, {\n//       headers: {'Authorization': 'Bearer YOUR_API_KEY'}\n//     });\n//     console.log(response.data);\n//   } catch (error) {\n//     console.error(error);\n//   }\n// }\n// sendEmail();` },
                    { lang: 'Java', snippet: `// Example using Apache HttpClient for REST API\n// import org.apache.http.client.methods.HttpPost;\n// import org.apache.http.entity.StringEntity;\n// import org.apache.http.impl.client.CloseableHttpClient;\n// import org.apache.http.impl.client.HttpClients;\n\n// public class EmailSender {\n//   public static void main(String[] args) throws Exception {\n//     CloseableHttpClient httpClient = HttpClients.createDefault();\n//     HttpPost httpPost = new HttpPost("https://api.emailservice.com/send");\n//     httpPost.setHeader("Authorization", "Bearer YOUR_API_KEY");\n//     httpPost.setHeader("Content-Type", "application/json");\n//     String json = "{\\"to\\": \\"recipient@example.com\\", \\"subject\\": \\"Hello from Java\\", \\"body\\": \\"This is a test.\\"}";\n//     httpPost.setEntity(new StringEntity(json));\n//     httpClient.execute(httpPost);\n//     httpClient.close();\n//   }\n// }` },
                    { lang: 'PHP', snippet: `<?php\n// Example using cURL for REST API\n// $ch = curl_init('https://api.emailservice.com/send');\n// curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer YOUR_API_KEY', 'Content-Type: application/json'));\n// curl_setopt($ch, CURLOPT_POST, true);\n// curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['to' => 'recipient@example.com', 'subject' => 'Hello from PHP', 'body' => 'This is a test.']));\n// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n// $response = curl_exec($ch);\n// curl_close($ch);\n// echo $response;\n?>` },
                    { lang: 'Ruby', snippet: `require 'net/http'\nrequire 'uri'\nrequire 'json'\n\n# Example using Net::HTTP for REST API\n# uri = URI.parse("https://api.emailservice.com/send")\n# header = {'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_API_KEY'}\n# data = {to: 'recipient@example.com', subject: 'Hello from Ruby', body: 'This is a test.'}\n\n# http = Net::HTTP.new(uri.host, uri.port)\n# http.use_ssl = true\n# request = Net::HTTP::Post.new(uri.request_uri, header)\n# request.body = data.to_json\n\n# response = http.request(request)\n# puts response.body` },
                    { lang: 'C#', snippet: `// Example using HttpClient for REST API\n// using System.Net.Http;\n// using System.Text;\n// using System.Threading.Tasks;\n\n// public class EmailSender\n// {\n//     public static async Task SendEmailAsync()\n//     {\n//         using (var client = new HttpClient())\n//         {\n//             client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");\n//             var content = new StringContent("{\"to\": \"recipient@example.com\", \"subject\": \"Hello from C#\", \"body\": \"This is a test.\"}", Encoding.UTF8, "application/json");\n//             var response = await client.PostAsync("https://api.emailservice.com/send", content);\n//             response.EnsureSuccessStatusCode();\n//             string responseBody = await response.Content.ReadAsStringAsync();\n//             Console.WriteLine(responseBody);\n//         }\n//     }\n// }` },
                    { lang: 'Go', snippet: `// Example using net/http for REST API\n/*\npackage main\n\nimport (\n\t"bytes"\n\t"fmt"\n\t"net/http"\n)\n\nfunc main() {\n\tjsonStr := []byte(\`{"to": "recipient@example.com", "subject": "Hello from Go", "body": "This is a test."}\`)\n\treq, err := http.NewRequest("POST", "https://api.emailservice.com/send", bytes.NewBuffer(jsonStr))\n\tif err != nil {\n\t\tfmt.Println("Error creating request:", err)\n\t\treturn\n\t}\n\n\treq.Header.Set("Content-Type", "application/json")\n\treq.Header.Set("Authorization", "Bearer YOUR_API_KEY")\n\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\tfmt.Println("Error sending request:", err)\n\t\treturn\n\t}\n\tdefer resp.Body.Close()\n\n\tfmt.Println("Response Status:", resp.Status)\n}\n*/` },
                ].map((item, index) => (
                    <div key={index} className="mb-8 p-4 border border-purple-200 rounded-lg bg-purple-50">
                        <h3 className="text-xl sm:text-2xl font-semibold text-purple-600 mb-4">
                            How to send email from {item.lang}
                        </h3>
                        <p className="mb-3 text-gray-700 leading-relaxed">
                            Integrating an email API into your {item.lang} application is straightforward, often involving a few lines of code using HTTP requests or dedicated SDKs.
                        </p>
                        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto text-sm">
                            <code className={`language-${item.lang.toLowerCase()}`}>
                                {item.snippet}
                            </code>
                        </pre>
                        <p className="mt-3 text-sm text-gray-600">
                            *This is a simplified example. Refer to the specific API's documentation for full details and SDK usage.*
                        </p>
                    </div>
                ))}
            </section>

            {/* Email APIs for Internal Communications */}
            <section className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg mb-10 max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6">
                    Email APIs for Internal Communications: Beyond the Basics 🏢
                </h2>
                <p className="mb-4 leading-relaxed">
                    While Email APIs are widely used for customer-facing communications, their power truly shines in automating
                    **internal documentation mails (indocs mails)**, alerts, and system reports. Imagine automatically notifying your team
                    of critical system errors, sending daily performance summaries, or alerting them to new documentation updates.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>**System Alerts:** Receive instant notifications for application errors, server downtime, or security breaches.</li>
                    <li>**Automated Reports:** Generate and distribute daily, weekly, or monthly performance metrics, sales reports, or usage statistics to relevant teams.</li>
                    <li>**Documentation Updates:** Inform team members about new policy documents, updated procedures, or critical knowledge base articles automatically.</li>
                    <li>**Team Notifications:** Automate project updates, task assignments, or internal announcements to ensure everyone is on the same page.</li>
                </ul>
                <p className="leading-relaxed">
                    Leveraging a <span className="font-semibold text-indigo-600">transactional email API</span> for these internal use cases ensures consistency, trackability, and reduces manual effort,
                    leading to a more efficient and informed workforce.
                </p>
            </section>

            {/* Choosing the Right Email API */}
            <section className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg mb-10 max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6">
                    Choosing the Right Email API: Key Considerations 💡
                </h2>
                <p className="mb-4 leading-relaxed">
                    Selecting the ideal email API depends on your specific needs, whether it's for external transactional mails
                    or internal "indocs mails." Here are vital factors to consider:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg text-blue-700 mb-2">Free Tier & Pricing 💰</h3>
                        <p className="text-gray-700 text-sm">
                            Many providers offer generous free tiers. Evaluate these limits (e.g., emails/day or month)
                            against your expected volume, especially for "free email sending API" searches.
                        </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg text-green-700 mb-2">Deliverability & Scalability 📈</h3>
                        <p className="text-gray-700 text-sm">
                            Ensure emails land in the inbox, even for internal alerts. A good API offers high deliverability
                            rates and can scale effortlessly with your growing needs.
                        </p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg text-red-700 mb-2">Ease of Integration & Features 🛠️</h3>
                        <p className="text-gray-700 text-sm">
                            Look for comprehensive documentation, SDKs for your programming language, email templating,
                            analytics to "track internal email opens," webhooks, and email validation services.
                        </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg text-yellow-700 mb-2">Security & Compliance 🔒</h3>
                        <p className="text-gray-700 text-sm">
                            For "secure email API" searches, especially with sensitive "indocs mails," ensure the provider
                            offers robust security features (SPF, DKIM, DMARC) and adheres to data privacy regulations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Frequently Asked Questions (FAQ) */}
            <section className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg mb-10 max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-6">
                    Frequently Asked Questions (FAQs) 🤔
                </h2>

                <div className="space-y-4">
                    <details className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <summary className="font-semibold text-indigo-600 cursor-pointer text-lg">
                            What is transactional email API?
                        </summary>
                        <p className="mt-2 text-gray-700 leading-relaxed">
                            A transactional email API is designed for sending automated, one-to-one emails triggered by
                            user actions or system events. Examples include password resets, order confirmations, and
                            importantly, internal system alerts or reports ("indocs mails"). These APIs prioritize reliable
                            and fast delivery.
                        </p>
                    </details>

                    <details className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <summary className="font-semibold text-indigo-600 cursor-pointer text-lg">
                            Why use an email API for internal communications?
                        </summary>
                        <p className="mt-2 text-gray-700 leading-relaxed">
                            Using an email API for internal communications automates repetitive tasks, ensures consistent
                            messaging, provides delivery and open tracking, and reduces the manual overhead of sending
                            notifications, reports, or documentation updates across teams.
                        </p>
                    </details>

                    <details className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <summary className="font-semibold text-indigo-600 cursor-pointer text-lg">
                            How to improve email deliverability for internal alerts?
                        </summary>
                        <p className="mt-2 text-gray-700 leading-relaxed">
                            Even for internal alerts, good deliverability is key. Use a reputable email API service,
                            ensure proper email authentication (SPF, DKIM, DMARC), maintain a clean internal recipient
                            list, and monitor bounce rates. For very high volumes, a dedicated IP might be beneficial.
                        </p>
                    </details>

                    <details className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <summary className="font-semibold text-indigo-600 cursor-pointer text-lg">
                            How to track internal email opens?
                        </summary>
                        <p className="mt-2 text-gray-700 leading-relaxed">
                            Most Email APIs provide analytics dashboards and webhooks to track email events, including
                            opens, clicks, and bounces. This is achieved through tiny, invisible tracking pixels embedded
                            in the email, allowing you to monitor engagement with your internal communications.
                        </p>
                    </details>

                    <details className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <summary className="font-semibold text-indigo-600 cursor-pointer text-lg">
                            Can I send internal documents via email API?
                        </summary>
                        <p className="mt-2 text-gray-700 leading-relaxed">
                            Yes, most email APIs support sending attachments. You can send internal documents, reports,
                            or other files as email attachments. Always consider the security implications and file size limits
                            of the API provider when sending sensitive or large documents.
                        </p>
                    </details>

                    <details className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <summary className="font-semibold text-indigo-600 cursor-pointer text-lg">
                            What are the rate limits for free email APIs?
                        </summary>
                        <p className="mt-2 text-gray-700 leading-relaxed">
                            Rate limits for free email APIs vary significantly by provider. They typically range from
                            100 emails per day (e.g., SendGrid) to several thousand per month (e.g., Amazon SES in certain
                            conditions). Always check the specific provider's documentation for their free tier limitations.
                        </p>
                    </details>

                    <details className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <summary className="font-semibold text-indigo-600 cursor-pointer text-lg">
                            How to manage email templates with an API?
                        </summary>
                        <p className="mt-2 text-gray-700 leading-relaxed">
                            Most modern email APIs offer features for creating, storing, and managing email templates.
                            You can design your templates (often using HTML and dynamic merge tags) within their dashboard
                            or via API calls, then simply pass data to the template when sending an email to personalize content.
                        </p>
                    </details>
                </div>
            </section>

            {/* Ask Gemini Chat Section */}
            <section className="bg-indigo-700 p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg max-w-4xl mx-auto text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
                    Got More Questions? Ask Gemini! 🤖
                </h2>
                <p className="text-center mb-6 leading-relaxed">
                    Our AI assistant is here to help you dive deeper into Email APIs and their applications.
                    Feel free to ask any related questions!
                </p>

                <div className="flex flex-col h-96 bg-indigo-800 rounded-lg shadow-inner overflow-hidden mb-6">
                    <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                        {chatHistory.length === 0 ? (
                            <p className="text-center text-indigo-300 mt-16">
                                Type your question below to chat with Gemini!
                            </p>
                        ) : (
                            chatHistory.map((msg, index) => (
                                <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    <div className={`inline-block p-3 rounded-lg max-w-[80%] break-words ${
                                        msg.role === 'user' ? 'bg-indigo-300 text-indigo-900 rounded-br-none' : 'bg-indigo-600 text-white rounded-bl-none'
                                    }`}>
                                        {msg.parts[0].text}
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="text-center text-indigo-300 mt-4">
                                <span className="animate-pulse">Typing...</span>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-indigo-900 border-t border-indigo-700 flex items-center">
                        <input
                            type="text"
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your question here..."
                            className="flex-1 p-3 rounded-l-lg bg-indigo-700 border border-indigo-600 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleAskGemini}
                            className={`p-3 rounded-r-lg font-bold transition-all duration-300 flex items-center justify-center ${
                                isLoading ? 'bg-indigo-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 transform active:scale-95'
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Send"
                            )}
                        </button>
                    </div>
                </div>
            </section>

            {/* Conclusion */}
            <footer className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg text-center max-w-4xl mx-auto mt-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4">
                    Start Automating Your Communications Today! 🚀
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    Email APIs are powerful tools that can streamline your communication workflows,
                    both externally with customers and internally with your teams. By leveraging
                    these services, you can build efficient, scalable, and reliable email solutions
                    for any application.
                </p>
                <a
                    href="/" // Placeholder for a real "explore APIs" link
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                    Explore Email API Solutions
                </a>
            </footer>
        </article>
    );
};

export default Home;
