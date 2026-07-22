import { motion } from "framer-motion";

const features = [
  {
    title: "Structured Courses",
    description:
      "Learn through carefully organized modules built by real instructors.",
  },
  {
    title: "Progress Tracking",
    description:
      "See exactly how far you've come with visual progress dashboards.",
  },
  {
    title: "AI-Powered Help",
    description:
      "Get instant explanations, quizzes, and study plans from EduSphere AI.",
  },
  {
    title: "Certificates",
    description:
      "Earn shareable certificates when you complete a course.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          Everything you need to learn better
        </h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 text-lg">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;