import { Header } from "../components/Header"
import { ConversationList } from "../components/ConversationList"
import { Analytics } from "../components/Analytics"


export default function Home() {
  return (
    <main className="min-h-screen --ring">
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <Header />
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-emerald-600 rounded-full" />
            <h2 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h2>
          </div>
          <Analytics />
        </div>

        <div className="mt-16">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-emerald-600 rounded-full" />
            <h2 className="text-2xl font-semibold text-gray-900">Recent Conversations</h2>
          </div>
          <ConversationList />
        </div>
      </div>
    </main>
    
  )
}
