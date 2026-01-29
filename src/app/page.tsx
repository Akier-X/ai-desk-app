export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">AI Desk Concierge</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your AI-powered desk gadget recommendation platform
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-2">🤖 AI Recommendations</h2>
            <p>Get personalized gadget recommendations based on your budget</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-2">🖼️ Desk Setups</h2>
            <p>Share and explore beautiful desk environment setups</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-bold mb-2">💰 Affiliate Links</h2>
            <p>Support creators while finding the perfect gadgets</p>
          </div>
        </div>
      </div>
    </main>
  );
}
