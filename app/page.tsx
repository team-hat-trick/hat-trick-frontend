import Link from "next/link";
import {
  Clock,
  Target,
  Users,
  Activity,
  Radio,
  ThumbsUp,
  BrainCircuit,
  ArrowRight,
  ChevronRight,
  PlayCircle,
  ChartColumn,
} from "lucide-react";
import Image from "next/image";
import mainLogo from "@/assets/images/main_logo.png";
import { createClient } from "@/lib/utils/supabase/server";
import { signOutAction } from "@/app/auth/action";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data: profileData } = await supabase
      .from("user_profile")
      .select("*")
      .eq("user_id", user.id)
      .single();
    profile = profileData;
  }

  console.log(profile);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-20 h-20 rounded-lg flex items-center justify-center text-black group-hover:transition-colors">
              <Image src={mainLogo} alt="main_logo" width={60} height={60} />
            </div>
            <span className="font-bold text-lg tracking-tight">HAT-TRICK</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            {profile ? (
              <div className="flex items-center gap-4">
                <Link href="/onboarding" className="flex items-center gap-2">
                  <Image
                    src={profile.avatar_url}
                    alt="user"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <p className="text-white/80 font-bold">{`${profile.name}님 반가워요!`}</p>
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-white/20 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all font-semibold"
                  >
                    로그아웃
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="bg-white text-black px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors"
                >
                  시작하기
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-emerald-400 mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Premium Football Community
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
              데이터로 즐기는
              <br />
              축구의 모든 순간
            </h1>

            <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-12 leading-relaxed">
              실시간 경기 스코어부터 AI 전술 분석, 팬들의 열정적인 커뮤니티까지.
              <br className="hidden md:block" />
              당신이 선호하는 팀의 모든 뉴스를 가장 빠르게 확인하세요.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/dashboard"
                className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
              >
                대시보드 입장하기
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              {!user && (
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors backdrop-blur-md"
                >
                  회원가입
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Floating Stats Bar */}
        {/* <section className="relative z-20 max-w-5xl mx-auto px-6 -mt-10 mb-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl backdrop-blur-xl">
            {[
              {
                icon: <Clock className="w-5 h-5 text-emerald-400" />,
                stat: "24/7",
                label: "실시간 경기",
              },
              {
                icon: <Target className="w-5 h-5 text-emerald-400" />,
                stat: "ACC 98%",
                label: "AI 전술 분석",
              },
              {
                icon: <Users className="w-5 h-5 text-emerald-400" />,
                stat: "10K+",
                label: "열혈 팬들",
              },
              {
                icon: <Activity className="w-5 h-5 text-emerald-400" />,
                stat: "PRECISE",
                label: "정확한 데이터",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center md:items-start p-4 rounded-2xl bg-black/50 border border-white/5"
              >
                <div className="mb-4 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  {item.icon}
                </div>
                <div className="text-2xl font-bold tracking-tight mb-1">
                  {item.stat}
                </div>
                <div className="text-sm text-white/50">{item.label}</div>
              </div>
            ))}
          </div>
        </section> */}

        {/* Detailed Features Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                  단순한 중계를 넘어,
                  <br />
                  팬들을 위한 최상의 경험
                </h2>
                <p className="text-lg text-white/50 leading-relaxed">
                  현대적 스타일의 직관적인 인터페이스와 현대적인 데이터 시각화가
                  만났습니다. 우리는 팬들이 경기의 맥락을 더 깊이 이해할 수
                  있도록 돕습니다.
                </p>
              </div>
              <Link
                href="/features"
                className="group flex items-center gap-2 text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
              >
                모든 기능 확인하기
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Radio className="w-8 h-8 text-[#00BC7D]" />,
                  title: "실시간 매치 센터",
                  desc: "초단위로 업데이트되는 실시간 스코어와 라이브 경기 흐름 분석을 확인할 수 있어요.",
                  bgColor: "bg-[#00BC7D]/10",
                  borderColor: "border-[#00BC7D]/20",
                  hoverLine: "group-hover:via-[#00BC7D]/50",
                },
                {
                  icon: <ThumbsUp className="w-8 h-8 text-[#2B7FFF]" />,
                  title: "팬 평점 시스템",
                  desc: "경기가 끝난 후, 선수의 활약을 직접 평가하고 다른 팬들과 소통할 수 있어요.",
                  bgColor: "bg-[#2B7FFF]/10",
                  borderColor: "border-[#2B7FFF]/20",
                  hoverLine: "group-hover:via-[#2B7FFF]/50",
                },
                {
                  icon: <ChartColumn className="w-8 h-8 text-[#AD46FF]" />,
                  title: "AI 전술 및 스탯",
                  desc: "정교한 데이터 시각화를 통해 라인업 분석과 기대 득점(xG) 등 구체적인 데이터를 제공해요.",
                  bgColor: "bg-[#AD46FF]/10",
                  borderColor: "border-[#AD46FF]/20",
                  hoverLine: "group-hover:via-[#AD46FF]/50",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative p-8 rounded-3xl bg-neutral-900 border border-white/5 hover:bg-neutral-800 transition-colors"
                >
                  <div
                    className={`absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent ${feature.hoverLine} transition-colors`}
                  />
                  <div
                    className={`mb-8 w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center border ${feature.borderColor} group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-white/50 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="relative p-12 md:p-24 rounded-[3rem] bg-gradient-to-b from-neutral-900 to-black border border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center bg-bottom opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                  지금 바로 축구 팬들의
                  <br />
                  새로운 공간에 합류하세요
                </h2>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-white text-black font-semibold text-lg hover:bg-neutral-200 transition-colors hover:scale-105 active:scale-95 ease-out duration-200"
                >
                  무료로 시작하기
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-sm font-medium text-white/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 opacity-50 grayscale">
            <PlayCircle className="w-5 h-5" />
            <span className="font-bold text-lg tracking-tight">HAT-TRICK</span>
          </div>
          <p>
            © 2026 HAT-TRICK. ALL RIGHTS RESERVED. FOOTBALL DATA POWERED BY
            OPTA.
          </p>
        </div>
      </footer>
    </div>
  );
}
