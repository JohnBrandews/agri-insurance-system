import Link from "next/link";
import Image from "next/image";
import { Shield, CloudRain, TrendingUp, ArrowRight, MapPin, Globe, CheckCircle, Zap, Users, Heart } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import SessionMenu from "@/components/layout/SessionMenu";

function getDashboardHref(role: string) {
  if (role === "SUPER_ADMIN") return "/super-admin";
  if (role === "INSURER") return "/insurer";
  if (role === "AGENT") return "/agent";
  return "/farmer";
}

export default async function Home() {
  const session = await getSession();
  const currentUser = session
    ? await prisma.user.findUnique({
        where: { id: session.id },
        select: { name: true, profileImageUrl: true, role: true },
      })
    : null;

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/30 transition-all">
              <Shield className="w-6 h-6 text-[#A7E92F]" />
            </div>
            <span className="text-xl font-bold text-[#A7E92F] uppercase tracking-tighter">FarmMan</span>
          </Link>
          <div className="flex items-center gap-4 md:gap-8 text-white font-semibold">
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="hover:text-emerald-300 transition-colors">Features</Link>
              <Link href="#process" className="hover:text-emerald-300 transition-colors">How it Works</Link>
              <Link href="#impact" className="hover:text-emerald-300 transition-colors">Impact</Link>
            </div>
            {currentUser ? (
              <SessionMenu
                name={currentUser.name}
                imageUrl={currentUser.profileImageUrl}
                dashboardHref={getDashboardHref(currentUser.role)}
              />
            ) : (
              <Link href="/login" className="bg-white/20 backdrop-blur-md hover:bg-white/30 py-2 px-6 rounded-xl border border-white/20 transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[800px] overflow-hidden">
        <Image
          src="/images/homepage_clean.png"
          alt="Modern Farming"
          fill
          className="object-cover object-center"
          priority
        />
        
        {/* Responsive padding and centering to balance visibility for both Nav and Buttons */}
        <div className="absolute inset-0 flex flex-col justify-center pt-24 pb-32 sm:pt-28 sm:pb-40 lg:pb-48 px-6 sm:px-12 lg:px-24">
          <div className="max-w-3xl w-full text-white space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-emerald-500/40">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Trusted by 10k+ Farmers Across Africa</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[0.95] drop-shadow-2xl">
              Climate Resilience <br />
              <span className="text-[#A7E92F]">Simplified.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/90 font-medium max-w-xl leading-snug drop-shadow-lg">
              Protecting livelihoods through data-driven micro-insurance. Seamless payouts delivered directly to your mobile wallet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link 
                href="/login" 
                className="bg-[#436728] hover:bg-[#4d752e] text-white font-bold py-4 px-10 rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center justify-center text-base sm:text-lg"
              >
                Join the Network
                <ArrowRight className="w-5 h-5 ml-3" />
              </Link>
              <Link 
                href="/login" 
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold py-4 px-10 rounded-2xl border border-white/30 transition-all flex items-center justify-center text-base sm:text-lg"
              >
                Explore Policies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards - positioned to overlap hero slightly */}
      <section id="features" className="relative z-20 max-w-7xl mx-auto px-6 -mt-32 md:-mt-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <CloudRain className="w-8 h-8 text-emerald-600" />, title: "Smart Payouts", desc: "Real-time weather data triggers instant payouts to your mobile wallet. No complicated claims.", bg: "bg-emerald-50" },
            { icon: <MapPin className="w-8 h-8 text-blue-600" />, title: "Precision Mapping", desc: "GPS field mapping ensures your specific acreage is protected based on hyperlocal weather stations.", bg: "bg-blue-50" },
            { icon: <Zap className="w-8 h-8 text-amber-600" />, title: "Instant Alerts", desc: "Stay informed with real-time climate alerts and early warning notifications via SMS.", bg: "bg-amber-50" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 group hover:-translate-y-2 transition-all duration-500">
              <div className={`${item.bg} w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW: Our Process Section */}
      <section id="process" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">How it Works</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Getting protected takes less than five minutes. Here is our simple three-step process.</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Connector Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
          
          {[
            { step: "01", title: "Map Your Farm", desc: "Register your field using our precision GPS mapping tool to define your specific coverage area." },
            { step: "02", title: "Pick a Policy", desc: "Select a weather-indexed plan that matches your crop type and seasonal risk profile." },
            { step: "03", title: "Automated Protection", desc: "Sit back and farm. If rainfall or drought hits index limits, payouts trigger automatically." }
          ].map((item, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-black mb-8 border-8 border-white">
                {item.step}
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h4>
              <p className="text-slate-500 text-center font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section - Refined for General Empowerment */}
      <section id="impact" className="py-24 bg-white overflow-hidden relative border-t border-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Our Mission</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tight text-slate-900">
              Empowering <br />
              <span className="text-emerald-600">Every Farmer.</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              Agriculture is the backbone of our economy. Our mission is to provide every smallholder farmer with the financial resilience they need to thrive in a changing climate.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-4xl font-black text-slate-900">10k+</p>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Active Beneficiaries</p>
              </div>
              <div>
                <p className="text-4xl font-black text-emerald-600">12 countries</p>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Global Impact</p>
              </div>
            </div>
            <div className="pt-6">
               <Link href="/login" className="inline-flex items-center text-emerald-600 font-black text-xl hover:text-emerald-700 group">
                 Join our Impact Movement
                 <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>
          </div>
          <div className="relative">
             <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white ring-1 ring-slate-100">
                <Image 
                  src="/images/womenfarm.jpg"
                  alt="Sustainable Farming"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                />
             </div>
             {/* Decorative Background Element */}
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#A7E92F]/20 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
      </section>

      {/* Statistics Section - Expanded */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-8">
              Reliable protection <br /> 
              at scale.
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
              Our infrastructure is built for speed and transparency. By leveraging satellite imagery and mobile financial services, we eliminate the friction in traditional insurance.
            </p>
            <div className="space-y-10">
              {[
                { icon: <Globe className="w-8 h-8" />, title: "Hyper-Local Coverage", desc: "Satellite data allows us to cover farmers in the most remote areas with exact weather metrics." },
                { icon: <TrendingUp className="w-8 h-8" />, title: "Proven Resilience", desc: "During last year's severe drought, our network paid out over $1.5M in under 48 hours." }
              ].map((item, i) => (
                <div key={i} className="flex space-x-6">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-emerald-500 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-800 mb-2">{item.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-emerald-500 text-white p-10 rounded-[3rem] shadow-emerald-200 shadow-2xl flex flex-col justify-end h-80">
                <p className="text-6xl font-black">24h</p>
                <p className="font-bold opacity-80 uppercase tracking-widest text-sm mt-2">Payout speed</p>
              </div>
              <div className="bg-slate-900 text-white p-10 rounded-[3rem] flex flex-col justify-end h-64">
                <p className="text-5xl font-black">100%</p>
                <p className="font-bold opacity-70 uppercase tracking-widest text-sm mt-2">Transparent</p>
              </div>
            </div>
            <div className="pt-16 space-y-6">
              <div className="bg-[#A7E92F] text-slate-900 p-10 rounded-[3rem] shadow-lime-200 shadow-2xl flex flex-col justify-end h-64">
                <p className="text-5xl font-black">50k+</p>
                <p className="font-bold opacity-60 uppercase tracking-widest text-sm mt-2">Acres Protected</p>
              </div>
              <div className="bg-blue-600 text-white p-10 rounded-[3rem] shadow-blue-200 shadow-2xl flex flex-col justify-end h-80">
                <Users className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-5xl font-black">$2M+</p>
                <p className="font-bold opacity-80 uppercase tracking-widest text-sm mt-2">Total Paid</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-slate-900" />
              <span className="text-2xl font-black uppercase tracking-tighter">FarmMan</span>
            </div>
            <div className="flex flex-wrap justify-center gap-10 text-slate-400 font-black text-sm uppercase tracking-widest">
              <Link href="#" className="hover:text-slate-900 transition-colors">Infrastructure</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Our Vision</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Policy Data</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Connect</Link>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-50 text-center md:text-left flex flex-col md:flex-row justify-between text-slate-300 text-xs font-bold uppercase tracking-[0.2em]">
            <p>© 2026 FarmMan. Securing the Future of Food.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
               <Link href="#">Twitter / X</Link>
               <Link href="#">LinkedIn</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}



