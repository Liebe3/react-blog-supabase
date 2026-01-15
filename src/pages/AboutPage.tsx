import {
  FiArrowRight,
  FiBookOpen,
  FiGlobe,
  FiPenTool,
  FiStar,
  FiTarget,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: FiBookOpen,
      title: "Informative Content",
      description:
        "We provide well-researched articles to keep you informed and engaged.",
    },
    {
      icon: FiPenTool,
      title: "Expert Writers",
      description:
        "Our team of bloggers and writers bring quality content on a variety of topics.",
    },
    {
      icon: FiUsers,
      title: "Community Focused",
      description:
        "We encourage discussions, feedback, and connection between readers.",
    },
    {
      icon: FiGlobe,
      title: "Global Reach",
      description:
        "Our blog reaches readers worldwide, sharing knowledge across borders.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-emerald-600">BlogSpace</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sharing knowledge, stories, and insights from creators around the
            world. BlogSpace is your destination for quality blogging.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              To empower writers and readers by providing a platform for sharing
              meaningful content.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We strive to connect people through stories, insights, and
              knowledge, making blogging accessible to everyone.
            </p>
          </div>

          <div className="relative">
            <div className="bg-linear-to-br from-emerald-500 to-emerald-700 rounded-2xl p-8 text-white shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <FiTarget className="w-12 h-12 shrink-0" />
                <h3 className="text-2xl font-bold">Our Vision</h3>
              </div>
              <p className="text-lg opacity-95 leading-relaxed">
                To be the go-to platform for passionate bloggers worldwide. We
                envision a community where writers can express freely, readers
                can learn and engage, and ideas travel across borders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose BlogSpace?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We prioritize quality content, community engagement, and a smooth
            reading experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg hover:border-emerald-200 transition-all duration-300 border border-gray-200 group"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-emerald-50 group-hover:bg-emerald-100 rounded-full transition-colors">
                  <value.icon className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                {value.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-500 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Explore BlogSpace?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            Discover articles, share your stories, and join a community of
            passionate readers and writers.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
          >
            <FiStar className="w-5 h-5" /> Go to Blog{" "}
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
