function Pricing() {
  const plans = [
    { name: "Free", price: "₹0", desc: "Explore free courses and community discussions.", features: ["Access to free courses", "Discussion forum", "Study planner"] },
    { name: "Pro", price: "₹499/mo", desc: "For serious learners who want it all.", features: ["All free features", "Access to paid courses", "Certificates", "EduSphere AI"] },
    { name: "Instructor", price: "Free to join", desc: "Create and sell your own courses.", features: ["Unlimited course creation", "Revenue analytics", "Student management"] },
  ];

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          Simple, transparent pricing
        </h2>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h3 className="font-semibold text-gray-900 text-lg">{plan.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{plan.price}</p>
              <p className="text-sm text-gray-500 mt-2">{plan.desc}</p>
              <ul className="mt-6 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                    <span>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;