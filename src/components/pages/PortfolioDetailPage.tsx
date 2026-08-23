import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, CheckCircle, ArrowUpRight, Code, Globe, Calendar } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { getProjectBySlug, portfolioProjects } from '../../data/portfolioProjects';
import { trackPortfolioClick } from '../../utils/analytics';

export function PortfolioDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const project = slug ? getProjectBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'sr' ? 'Projekat nije pronađen' : 'Project not found'}
          </h1>
          <p className="text-gray-600 mb-8">
            {language === 'sr' ? 'Ovaj projekat ne postoji ili je uklonjen.' : 'This project does not exist or has been removed.'}
          </p>
          <button
            onClick={() => navigate('/izrada-sajta-detalji#case-study')}
            className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-violet-600 transition-all duration-300"
          >
            {language === 'sr' ? 'Nazad na Portfolio' : 'Back to Portfolio'}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Get related projects (same category, excluding current)
  const relatedProjects = portfolioProjects
    .filter((p) => p.id !== project.id)
    .slice(0, 3);

  // Projects flagged `nofollow` don't pass page authority to the client's site.
  const linkRel = project.nofollow ? 'noopener noreferrer nofollow' : 'noopener noreferrer';

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        {/* Hero Section with Project Image */}
        <section className="pt-28 md:pt-36 pb-0 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/20 to-white"></div>

          {/* Animated Background Circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
            {/* Back Button */}
            <div className="max-w-6xl mx-auto mb-8">
              <Link
                to="/izrada-sajta-detalji#case-study"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-violet-600 transition-colors duration-300 font-medium group"
              >
                <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
                {language === 'sr' ? 'Svi Projekti' : 'All Projects'}
              </Link>
            </div>

            {/* Project Header */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Left: Info */}
                <div className="animate-fade-in-up animation-delay-200">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags[language].map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 border border-violet-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                    {project.title}
                  </h1>

                  <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                    {project.longDescription[language]}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-6 mb-8">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-5 h-5 text-violet-500" />
                      <span className="text-sm font-medium">{project.clientIndustry[language]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5 text-violet-500" />
                      <span className="text-sm font-medium">{project.year}</span>
                    </div>
                  </div>

                  {/* Visit Website Button */}
                  <a
                    href={project.link}
                    target="_blank"
                    rel={linkRel}
                    onClick={() => trackPortfolioClick(project.title, project.link, language)}
                    className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white text-base font-semibold rounded-full hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <ExternalLink className="w-5 h-5" />
                    {language === 'sr' ? 'Poseti Web Sajt' : 'Visit Website'}
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </a>
                </div>

                {/* Right: Image */}
                <div className="animate-fade-in-up animation-delay-400">
                  <a
                    href={project.link}
                    target="_blank"
                    rel={linkRel}
                    onClick={() => trackPortfolioClick(project.title, project.link, language)}
                    className="group block relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/20 border-2 border-gray-100 hover:border-violet-400 transition-all duration-500 hover:shadow-violet-500/30"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-all duration-700"
                      loading="eager"
                      {...{ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>} />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                      <span className="text-white font-semibold flex items-center gap-2">
                        <ExternalLink className="w-5 h-5" />
                        {project.link.replace('https://', '').replace(/\/$/, '')}
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features & Technologies */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 desktop-vertical-nav-offset">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                {/* Features */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    {language === 'sr' ? 'Ključne Funkcionalosti' : 'Key Features'}
                  </h2>

                  <div className="space-y-4">
                    {project.features[language].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-50/50 to-indigo-50/50 border border-violet-100 hover:border-violet-300 transition-all duration-300 hover:shadow-md group"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex-shrink-0 flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    {language === 'sr' ? 'Tehnologije' : 'Technologies'}
                  </h2>

                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-5 py-3 rounded-xl bg-white border-2 border-gray-100 text-gray-800 font-semibold text-sm hover:border-violet-400 hover:text-violet-600 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Visit Site CTA */}
                  <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                    <h3 className="text-lg font-bold mb-2">
                      {language === 'sr' ? 'Pogledajte projekat uživo' : 'See the project live'}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {language === 'sr'
                        ? 'Kliknite na link ispod da posetite web sajt i vidite rezultat uživo.'
                        : 'Click the link below to visit the website and see the result live.'}
                    </p>
                    <a
                      href={project.link}
                      target="_blank"
                      rel={linkRel}
                      onClick={() => trackPortfolioClick(project.title, project.link, language)}
                      className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-semibold transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {project.link.replace('https://', '').replace(/\/$/, '')}
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="py-16 md:py-24 bg-gradient-to-b from-violet-50/50 via-indigo-50/30 to-pink-50/25 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 -right-20 w-72 h-72 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full opacity-10 blur-3xl animate-blob"></div>
              <div className="absolute bottom-10 -left-20 w-80 h-80 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
                  {language === 'sr' ? 'Ostali Projekti' : 'Other Projects'}
                </h2>
                <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
                  {language === 'sr'
                    ? 'Pogledajte i ostale projekte koje smo realizovali.'
                    : 'Check out other projects we have completed.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedProjects.map((relatedProject) => (
                    <Link
                      key={relatedProject.id}
                      to={`/portfolio/${relatedProject.slug}`}
                      className="group relative block bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-violet-400 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-2"
                    >
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden bg-gray-50">
                        <img
                          src={relatedProject.image}
                          alt={relatedProject.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                        <div className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-45 transition-all duration-500">
                          <ArrowUpRight className="w-4 h-4 text-violet-600" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 bg-gradient-to-b from-white to-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors duration-300">
                          {relatedProject.title}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {relatedProject.tags[language].map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 border border-violet-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Glow */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-pink-500 blur-xl opacity-20"></div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                  <Link
                    to="/izrada-sajta-detalji#case-study"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 text-base font-semibold rounded-full hover:bg-gray-900 hover:text-white border-2 border-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {language === 'sr' ? 'Svi Projekti' : 'All Projects'}
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 desktop-vertical-nav-offset">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {language === 'sr'
                  ? 'Želite Sličan Projekat?'
                  : 'Want a Similar Project?'}
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                {language === 'sr'
                  ? 'Kontaktirajte nas za besplatnu konsultaciju. Razgovaraćemo o vašim potrebama i predložiti najbolje rešenje za vaš biznis.'
                  : 'Contact us for a free consultation. We\'ll discuss your needs and suggest the best solution for your business.'}
              </p>
              <button
                onClick={() => navigate('/izrada-sajta-detalji')}
                className="group px-8 py-4 bg-gray-900 text-white text-lg font-semibold rounded-full hover:bg-white hover:text-gray-900 border-2 border-gray-900 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
              >
                {language === 'sr' ? 'Pogledaj Ponudu' : 'See Our Offer'}
                <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
