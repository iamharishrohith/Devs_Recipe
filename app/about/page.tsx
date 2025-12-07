import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Linkedin, MessageCircle, Instagram, MapPin, Globe } from "lucide-react"
import { Card } from "@/components/ui/card"

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">About Us</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We are passionate about making developer tools that save time and boost productivity.
            </p>
          </div>
        </section>

        {/* Company Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src="/monarch-realms-logo.png"
                    alt="Monarch Realms"
                    width={80}
                    height={80}
                    className="rounded-xl shadow-lg"
                  />
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Monarch Realms</h2>
                    <p className="text-emerald-600 font-medium">Software Development Company</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Monarch Realms is a forward-thinking software development company dedicated to building innovative
                  tools and solutions for the developer community. Our mission is to simplify complex workflows and
                  empower developers to focus on what matters most - building great software.
                </p>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Founded with a vision to bridge the gap between idea and implementation, we create tools that
                  streamline the development process, from project scaffolding to deployment automation.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>Global Remote Team</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <span>monarchrealms.com</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl transform rotate-3" />
                <Card className="relative p-8 bg-white">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Our Products</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Image src="/devs-recipe-logo.png" alt="Devs Recipe" width={50} height={50} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Devs Recipe</h4>
                        <p className="text-sm text-slate-600">Visual project scaffolder</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-slate-400">Soon</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">More Coming</h4>
                        <p className="text-sm text-slate-600">Exciting tools in development</p>
                      </div>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Meet the Developer</h2>
            <Card className="p-8 bg-white shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center text-white text-4xl font-bold">
                  MR
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Harish Rohith S</h3>
                  <p className="text-emerald-600 font-medium mb-4">Full Stack Developer @ Monarch Realms</p>
                  <p className="text-slate-600 mb-6">
                    Passionate about building developer tools and making complex workflows simple. Specializing in
                    React, Next.js, Node.js, and cloud technologies.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <a
                      href="https://www.linkedin.com/in/sparrow27off-hr27?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                    <a
                      href="https://x.com/sparrow27_hr?t=j7lwe7HoKoLh_Z-MAV9FuQ&s=09"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <XIcon className="w-4 h-4" />X (Twitter)
                    </a>
                    <a
                      href="https://www.instagram.com/sparrow27_official?igsh=MWx4bWQzNXp6dmo1eA=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                    <a
                      href="https://wa.me/+918903416887"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
