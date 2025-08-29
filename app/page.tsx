import { Button } from "@/components/ui/button"
import { Heart, Search, Users, User } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 overflow-hidden flex items-center justify-center">
                  <img 
                    src="/SL-091823-63290-21.jpg" 
                    alt="VolunteerVerse Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-gray-900">VolunteerVerse</span>
              </div>
            </div>
            <nav className="flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Opportunities
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                About us
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                Contact us
              </a>
                <Link href="/login">
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-indigo-500 to-blue-600
                            text-white font-semibold px-6 py-2 rounded-full
                            shadow-md hover:shadow-lg
                            hover:from-indigo-600 hover:to-blue-700
                            transform hover:scale-105 active:scale-95
                            transition-all duration-200">
                    Login
                </Button>
                </Link>
                {/* Sign Up Button */}
                <Link href="/register">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-gradient-to-r from-pink-500 to-pink-600
               text-white font-semibold px-6 py-2 rounded-full
               shadow-md hover:shadow-lg
               hover:from-pink-600 hover:to-pink-700
               transform hover:scale-105 active:scale-95
               transition-all duration-200 border-0"
                    >
                        Sign Up
                    </Button>
                </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Background Image Holder */}
        <div className="absolute inset-0">
          <img 
            src="/earth world green.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for Better Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-2xl">
                Your hands hold the power to heal the planet.
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-100 leading-relaxed mb-8 drop-shadow-lg">
                Start with one good deed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 border-0">
                    Get Started Today
                  </Button>
                </Link>
                <Link href="#">
          
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Empowering Volunteers. Enabling Change.</h2>

          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-8">Our Partners</h3>

            {/* Decorative Hearts */}
            <div className="flex justify-center items-center mb-8">
              <div className="flex space-x-2 mr-8">
                <Heart className="w-6 h-6 text-blue-500 fill-current" />
                <Heart className="w-6 h-6 text-pink-500 fill-current" />
              </div>
              <div className="flex space-x-2 ml-8">
                <Heart className="w-6 h-6 text-blue-500 fill-current" />
                <Heart className="w-6 h-6 text-pink-500 fill-current" />
              </div>
            </div>

            {/*  Grid */}
            <div className="flex flex-col items-center space-y-8">
              {/* Main Center Logo - WHO */}
              <div className="text-center transform scale-110">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src="/who-emblem.png" 
                    alt="World Health Organization Logo" 
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <p className="text-lg font-semibold text-gray-800">World Health Organization</p>
                <p className="text-sm text-gray-500">Leading Global Health</p>
              </div>

              {/* Supporting Organizations Row */}
              <div className="flex flex-wrap justify-center items-center gap-6 max-w-4xl">
                <div className="text-center transform hover:scale-105 transition-transform duration-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md hover:shadow-lg transition-all duration-200">
                    <img 
                      src="/UN_emblem_blue.svg.png" 
                      alt="United Nations Logo" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">United Nations</p>
                </div>

                <div className="text-center transform hover:scale-105 transition-transform duration-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md hover:shadow-lg transition-all duration-200">
                    <img 
                      src="/UNICEF_Logo_(cropped).png" 
                      alt="UNICEF Logo" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">UNICEF</p>
                </div>

                <div className="text-center transform hover:scale-105 transition-transform duration-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md hover:shadow-lg transition-all duration-200">
                    <img 
                      src="/3d345c24d0ccbc97935447d0858e4564.png" 
                      alt="Interpol Logo" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Interpol</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-6">Trusted by leading organizations worldwide</p>
          </div>
        </div>

        {/* Content Paragraphs */}
        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-gray-700 leading-relaxed mb-6">
            As tech professionals, we often build solutions that scale but sometimes, the most powerful impact starts on
            the ground, person to person. Our volunteer platform connects passionate, skilled individuals with
            real-world causes that need them. Whether you're a developer, designer, organizer, or simply someone who
            cares, your time and talent can spark meaningful change. We've made it simple, secure, and smart so you can
            focus on what truly matters: making a difference.
          </p>

          <p className="text-gray-700 leading-relaxed">
            In a world driven by algorithms and automation, the human touch still matters most. Our volunteer platform
            isn't just a tool—it's a bridge between skill and purpose. We believe that behind every line of code, every
            product design, and every strategy session, there's a person who wants to contribute to something bigger
            than themselves. That's why we built this space—for professionals who aren't just chasing progress, but want
            their impact to reach beyond screens. Here, your time isn't just volunteered—it's valued, tracked, and
            transformed into real change. Because good tech empowers people and we're here to prove it.
          </p>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-12">How to become one of Us</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Sign Up */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-gray-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sign Up</h4>
              <p className="text-sm text-gray-600">As a volunteer or organizer</p>
            </div>

            {/* Match */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Match</h4>
              <p className="text-sm text-gray-600">Find opportunities or applicants that fit your needs</p>
            </div>

            {/* Engage */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Engage</h4>
              <p className="text-sm text-gray-600">Connect and make an impact</p>
            </div>
          </div>

          <Link href="/register">
            <Button 
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 border-0"
            >
              Become one of Us now
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">© 2023 VolunteerVerse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
