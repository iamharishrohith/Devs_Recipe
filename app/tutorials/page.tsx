import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TutorialSection } from "@/components/tutorial-section"

export default function TutorialsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Tutorials</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Learn how to use your generated scripts and set up your development environment.
            </p>
          </div>
        </section>

        {/* Tutorials Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <TutorialSection />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
