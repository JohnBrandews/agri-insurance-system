import Link from "next/link";
import Image from "next/image";
import { Shield, CloudRain, Users, TrendingUp, CheckCircle, ArrowRight, Sprout, MapPin, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">FarmMan Insurance</span>
            </div>
            <Link 
              href="/login" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all border border-white/30"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-[85vh] overflow-hidden">
        <Image
          src="/images/homepage.jpg"
          alt="Farmer in a golden wheat field at sunset"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>

        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-24">
          <div className="max-w-4xl mx-auto w-full text-center text-white space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Weather-Indexed Micro-Insurance for Farmers</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Protecting Your Harvest,<br />
              <span className="text-emerald-400">Securing Your Future</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto font-medium">
              Data-driven crop insurance with automatic payouts when weather triggers are met. No claims to file. No delays.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-10 rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all hover:-translate-y-1 text-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href="#features" 
                className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-4 px-10 rounded-2xl border border-white/40 transition-all hover:-translate-y-1 text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 py-16 -mt-20 relative z-10 mx-4 sm:mx-8 lg:mx-16 rounded-3xl shadow-2xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">10,000+</div>
              <div className="text-emerald-200 font-medium">Farmers Protected</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">50K+</div>
              <div className="text-emerald-200 font-medium">Acres Insured</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">$2M+</div>
              <div className="text-emerald-200 font-medium">Payouts Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">24hrs</div>
              <div className="text-emerald-200 font-medium">Average Payout Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
              Why Choose FarmMan?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built for farmers, by people who understand agriculture. Simple, transparent, and always there when you need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <CloudRain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Automatic Payouts</h3>
              <p className="text-slate-600 leading-relaxed">
                When rainfall drops below your policy threshold, payouts are triggered automatically. No claims to file, no paperwork.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">GPS Farm Mapping</h3>
              <p className="text-slate-600 leading-relaxed">
                Our field agents use GPS to map your farm boundaries accurately, ensuring precise coverage for your exact location.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Field Agent Support</h3>
              <p className="text-slate-600 leading-relaxed">
                Local agents in your region provide personalized support, from registration to claims assistance.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-violet-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Affordable Premiums</h3>
              <p className="text-slate-600 leading-relaxed">
                Micro-insurance policies designed for smallholder farmers. Pay only for what you need, when you need it.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Instant Activation</h3>
              <p className="text-slate-600 leading-relaxed">
                Get covered within minutes. Our streamlined process means you're protected before the next weather event.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Trusted Protection</h3>
              <p className="text-slate-600 leading-relaxed">
                Backed by licensed insurance companies and regulated by national authorities. Your coverage is guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get insured in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                <span className="text-4xl font-extrabold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Register Your Farm</h3>
              <p className="text-slate-600 leading-relaxed">
                Meet with a field agent who will map your farm using GPS and register your details in our system.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
                <span className="text-4xl font-extrabold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Choose Your Policy</h3>
              <p className="text-slate-600 leading-relaxed">
                Select coverage based on your crop type, location, and rainfall threshold that matches your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/30">
                <span className="text-4xl font-extrabold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Get Automatic Payouts</h3>
              <p className="text-slate-600 leading-relaxed">
                When rainfall drops below your threshold, receive automatic payouts directly to your mobile wallet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Ready to Protect Your Farm?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of farmers who trust FarmMan Insurance for their crop protection. Get covered today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-10 rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all hover:-translate-y-1 text-lg"
            >
              Sign Up Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-4 px-10 rounded-2xl border border-white/30 transition-all hover:-translate-y-1 text-lg"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FarmMan Insurance</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2024 FarmMan Insurance. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
