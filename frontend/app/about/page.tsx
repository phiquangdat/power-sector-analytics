export default function AboutPage() {
  const teamMembers = [
    {
      name: "Md Basharul Alam",
      role: "CEO & Co-Founder",
      initials: "MA",
      color: "green",
      description: "15+ years in sustainability and regulatory compliance",
    },
    {
      name: "Sean Afamefuna",
      role: "CTO & Co-Founder",
      initials: "SA",
      color: "blue",
      description: "Full-stack engineer specializing in real-time data systems",
    },
    {
      name: "Elisha Itani",
      role: "Head of Data Science",
      initials: "EI",
      color: "purple",
      description: "PhD in Environmental Engineering with carbon expertise",
    },
    {
      name: "Nnanna Otuh",
      role: "Head of Product",
      initials: "NO",
      color: "orange",
      description: "Product strategist with energy sector experience",
    },
    {
      name: "Dat Phi",
      role: "Head of Business Development",
      initials: "DP",
      color: "teal",
      description: "Business development expert in renewable energy",
    },
  ];

  const colorClasses = {
    green: {
      bg: "bg-green-500",
      hoverBg: "hover:bg-green-500/10",
      text: "text-green-400",
    },
    blue: {
      bg: "bg-blue-500",
      hoverBg: "hover:bg-blue-500/10",
      text: "text-blue-400",
    },
    purple: {
      bg: "bg-purple-500",
      hoverBg: "hover:bg-purple-500/10",
      text: "text-purple-400",
    },
    orange: {
      bg: "bg-orange-500",
      hoverBg: "hover:bg-orange-500/10",
      text: "text-orange-400",
    },
    teal: {
      bg: "bg-teal-500",
      hoverBg: "hover:bg-teal-500/10",
      text: "text-teal-400",
    },
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-slate-50"></div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl"></div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-green-700 to-gray-900 bg-clip-text text-transparent">
              About The Nexus
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet the team behind the sustainability intelligence platform
            transforming the power sector&apos;s journey to net-zero by 2050.
          </p>
        </div>

        {/* Team Section */}
        <div className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="text-center group p-6 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-xl transition-all duration-300 hover:border-green-400/50 hover:scale-105 hover:shadow-xl hover:shadow-green-100/50"
              >
                <div
                  className={`w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-gray-200/50 group-hover:ring-green-400/50 transition-all duration-300 shadow-lg`}
                >
                  <div
                    className={`w-16 h-16 ${
                      colorClasses[member.color as keyof typeof colorClasses].bg
                    } rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <span className="text-white font-semibold text-xl">
                      {member.initials}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p
                  className={`text-sm font-semibold ${
                    colorClasses[member.color as keyof typeof colorClasses].text
                  } mb-4`}
                >
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
