import Link from "next/link";
import Image from "next/image";
import { Shield, CloudRain, TrendingUp, ArrowRight, MapPin, Globe, CheckCircle, Zap, Users, Heart } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import SessionMenu from "@/components/layout/SessionMenu";
import LandingMobileMenu from "@/components/layout/LandingMobileMenu";

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
      <nav className="absolute top-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/30 transition-all">
              <Shield className="w-6 h-6 text-[#A7E92F]" />
            </div>
            <span className="text-xl font-bold text-[#A7E92F] uppercase tracking-tighter">FarmMan</span>
          </Link>
          <div className="flex items-center gap-3 text-white font-semibold md:gap-8">
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="hover:text-emerald-300 transition-colors">Features</Link>
              <Link href="#process" className="hover:text-emerald-300 transition-colors">How it Works</Link>
              <Link href="#impact" className="hover:text-emerald-300 transition-colors">Impact</Link>
            </div>
            <div className="hidden md:block">
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
            <LandingMobileMenu
              currentUser={currentUser}
              dashboardHref={currentUser ? getDashboardHref(currentUser.role) : "/"}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full min-h-[720px] overflow-hidden sm:min-h-[800px] lg:h-[90vh]">
        <Image
          src="/images/homepage_clean.png"
          alt="Modern Farming"
          fill
          className="object-cover object-center"
          priority
        />
        
        {/* Responsive padding and centering to balance visibility for both Nav and Buttons */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 pb-20 pt-28 sm:px-12 sm:pb-40 sm:pt-28 lg:px-24 lg:pb-48">
          <div className="max-w-3xl w-full text-white space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="inline-flex max-w-full items-center space-x-2 rounded-full border border-emerald-500/40 bg-emerald-500/30 px-3 py-1.5 backdrop-blur-md sm:px-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] leading-none font-bold uppercase tracking-[0.2em] sm:tracking-widest">Trusted by 10k+ Farmers Across Africa</span>
            </div>
            
            <h1 className="text-4xl font-black tracking-tight leading-[0.95] drop-shadow-2xl sm:text-6xl lg:text-8xl">
              Climate Resilience <br />
              <span className="text-[#A7E92F]">Simplified.</span>
            </h1>
            
            <p className="max-w-xl text-base font-medium leading-snug text-white/90 drop-shadow-lg sm:text-xl">
              Protecting livelihoods through data-driven micro-insurance. Seamless payouts delivered directly to your mobile wallet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link 
                href="/login" 
                className="flex items-center justify-center rounded-2xl bg-[#436728] px-6 py-4 text-base font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-[#4d752e] sm:px-10 sm:text-lg"
              >
                Join the Network
                <ArrowRight className="w-5 h-5 ml-3" />
              </Link>
              <Link 
                href="/login" 
                className="flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-base font-bold text-white transition-all hover:bg-white/20 sm:px-10 sm:text-lg"
              >
                Explore Policies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards - positioned to overlap hero slightly */}
      <section id="features" className="relative z-20 mx-auto -mt-14 max-w-7xl px-4 sm:-mt-24 sm:px-6 md:-mt-40">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {[
            { icon: <CloudRain className="w-8 h-8 text-emerald-600" />, title: "Smart Payouts", desc: "Real-time weather data triggers instant payouts to your mobile wallet. No complicated claims.", bg: "bg-emerald-50" },
            { icon: <MapPin className="w-8 h-8 text-blue-600" />, title: "Precision Mapping", desc: "GPS field mapping ensures your specific acreage is protected based on hyperlocal weather stations.", bg: "bg-blue-50" },
            { icon: <Zap className="w-8 h-8 text-amber-600" />, title: "Instant Alerts", desc: "Stay informed with real-time climate alerts and early warning notifications via SMS.", bg: "bg-amber-50" }
          ].map((item, idx) => (
            <div key={idx} className="group rounded-[2rem] border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-500 hover:-translate-y-2 sm:rounded-[2.5rem] sm:p-10">
              <div className={`${item.bg} mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:rotate-6 sm:mb-8 sm:h-20 sm:w-20`}>
                {item.icon}
              </div>
              <h3 className="mb-3 text-2xl font-black text-slate-900 sm:mb-4 sm:text-3xl">{item.title}</h3>
              <p className="text-base font-medium leading-relaxed text-slate-500 sm:text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW: Our Process Section */}
      <section id="process" className="bg-white py-20 sm:py-32">
        <div className="mx-auto mb-14 max-w-7xl px-4 text-center sm:mb-20 sm:px-6">
          <h2 className="mb-6 text-4xl font-black text-slate-900 md:text-6xl">How it Works</h2>
          <p className="mx-auto max-w-2xl text-lg font-medium text-slate-500 sm:text-xl">Getting protected takes less than five minutes. Here is our simple three-step process.</p>
        </div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 md:grid-cols-3 md:gap-16">
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
      <section id="impact" className="relative overflow-hidden border-t border-slate-50 bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Our Mission</span>
            </div>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-7xl">
              Empowering <br />
              <span className="text-emerald-600">Every Farmer.</span>
            </h2>
            <p className="max-w-xl text-lg font-medium leading-relaxed text-slate-500 sm:text-xl">
              Agriculture is the backbone of our economy. Our mission is to provide every smallholder farmer with the financial resilience they need to thrive in a changing climate.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 sm:gap-8">
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
             <div className="relative z-10 aspect-square w-full overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl ring-1 ring-slate-100 sm:rounded-[3rem]">
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
      <section className="bg-slate-50 py-20 sm:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-32">
          <div>
            <h2 className="mb-8 text-4xl font-black leading-tight text-slate-900 md:text-6xl">
              Reliable protection <br /> 
              at scale.
            </h2>
            <p className="mb-10 text-lg font-medium leading-relaxed text-slate-500 sm:mb-12 sm:text-xl">
              Our infrastructure is built for speed and transparency. By leveraging satellite imagery and mobile financial services, we eliminate the friction in traditional insurance.
            </p>
            <div className="space-y-8 sm:space-y-10">
              {[
                { icon: <Globe className="w-8 h-8" />, title: "Hyper-Local Coverage", desc: "Satellite data allows us to cover farmers in the most remote areas with exact weather metrics." },
                { icon: <TrendingUp className="w-8 h-8" />, title: "Proven Resilience", desc: "During last year's severe drought, our network paid out over $1.5M in under 48 hours." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 sm:gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-500 shadow-lg sm:h-16 sm:w-16">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="mb-2 text-xl font-black text-slate-800 sm:text-2xl">{item.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex h-60 flex-col justify-end rounded-[2rem] bg-emerald-500 p-8 text-white shadow-2xl shadow-emerald-200 sm:h-80 sm:rounded-[3rem] sm:p-10">
                <p className="text-5xl font-black sm:text-6xl">24h</p>
                <p className="font-bold opacity-80 uppercase tracking-widest text-sm mt-2">Payout speed</p>
              </div>
              <div className="flex h-52 flex-col justify-end rounded-[2rem] bg-slate-900 p-8 text-white sm:h-64 sm:rounded-[3rem] sm:p-10">
                <p className="text-4xl font-black sm:text-5xl">100%</p>
                <p className="font-bold opacity-70 uppercase tracking-widest text-sm mt-2">Transparent</p>
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6 sm:pt-16">
              <div className="flex h-52 flex-col justify-end rounded-[2rem] bg-[#A7E92F] p-8 text-slate-900 shadow-2xl shadow-lime-200 sm:h-64 sm:rounded-[3rem] sm:p-10">
                <p className="text-4xl font-black sm:text-5xl">50k+</p>
                <p className="font-bold opacity-60 uppercase tracking-widest text-sm mt-2">Acres Protected</p>
              </div>
              <div className="flex h-60 flex-col justify-end rounded-[2rem] bg-blue-600 p-8 text-white shadow-2xl shadow-blue-200 sm:h-80 sm:rounded-[3rem] sm:p-10">
                <Users className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-4xl font-black sm:text-5xl">$2M+</p>
                <p className="font-bold opacity-80 uppercase tracking-widest text-sm mt-2">Total Paid</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex flex-col items-center justify-between gap-8 md:mb-16 md:flex-row md:gap-12">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-slate-900" />
              <span className="text-2xl font-black uppercase tracking-tighter">FarmMan</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-center text-sm font-black uppercase tracking-widest text-slate-400 sm:gap-10">
              <Link href="#" className="hover:text-slate-900 transition-colors">Infrastructure</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Our Vision</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Policy Data</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Connect</Link>
            </div>
          </div>
          <div className="flex flex-col justify-between border-t border-slate-50 pt-10 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300 md:flex-row md:text-left">
            <p>© 2026 FarmMan. Securing the Future of Food.</p>
            <div className="mt-4 flex justify-center gap-8 md:mt-0">
               <Link href="#">Twitter / X</Link>
               <Link href="#">LinkedIn</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}



