'use client';

import { useState, useEffect } from 'react';
import {
  allSections,
  learningCenterStats
} from '@/data/soundLearningCenter';
import type {
  LearningSection,
  LearningTopic,
  Resource
} from '@/data/soundLearningCenter';

// Resource type badge component
const ResourceBadge = ({ type }: { type: Resource['type'] }) => {
  const colors = {
    video: 'bg-red-500/10 text-red-400 border-red-500/20',
    article: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    book: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    course: 'bg-green-500/10 text-green-400 border-green-500/20',
    research: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${colors[type]}`}>
      {type}
    </span>
  );
};

// Individual topic card - NO ACCORDIONS, fully expanded beautiful cards
const TopicCard = ({ topic }: { topic: LearningTopic }) => {
  return (
    <div className="w-full">
      <div className="group bg-gradient-to-br from-white/[0.07] via-white/[0.04] to-transparent rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 border border-white/10 hover:border-white/20 transition-all duration-700 hover:shadow-2xl hover:shadow-white/5 backdrop-blur-sm hover:scale-[1.01] transform">
        {/* Topic Header */}
        <div className="mb-8 md:mb-10 text-center">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight">
            {topic.title}
          </h3>
          <p className="text-gray-300 text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto">
            {topic.description}
          </p>
        </div>

        {/* Key Points */}
        <div className="mb-8 md:mb-10">
          <h4 className="text-xs md:text-sm font-bold text-netflix-red mb-5 md:mb-6 uppercase tracking-wider flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-netflix-red rounded-full"></span>
            Core Concepts
          </h4>
          <div className="grid gap-3 md:gap-4">
            {topic.keyPoints.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 md:gap-4 text-gray-200 bg-gradient-to-r from-white/[0.08] to-white/[0.03] rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 hover:from-white/[0.12] hover:to-white/[0.05] transition-all duration-500 border border-white/5 hover:border-white/10 group/point"
              >
                <span className="text-netflix-red mt-0.5 flex-shrink-0 text-xl md:text-2xl font-bold group-hover/point:scale-125 transition-transform duration-300">→</span>
                <span className="leading-relaxed text-sm md:text-base lg:text-lg">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-xs md:text-sm font-bold text-netflix-red mb-5 md:mb-6 uppercase tracking-wider flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-netflix-red rounded-full"></span>
            Curated Resources
          </h4>
          <div className="grid gap-4 md:gap-5 lg:gap-6 md:grid-cols-2">
            {topic.resources.map((resource, idx) => (
              <div
                key={idx}
                className="group/resource bg-gradient-to-br from-black/60 to-black/30 rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-7 border border-white/10 hover:border-netflix-red/40 transition-all duration-500 hover:shadow-xl hover:shadow-netflix-red/10 backdrop-blur-sm hover:scale-[1.02] transform"
              >
                <div className="flex items-start justify-between gap-3 mb-5">
                  <h5 className="text-lg font-semibold text-white flex-1 leading-snug">
                    {resource.url ? (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-netflix-red transition-colors inline-flex items-center gap-2 group/link"
                      >
                        <span className="group-hover/link:underline decoration-netflix-red/50 underline-offset-2">{resource.title}</span>
                        <svg className="w-4 h-4 opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      resource.title
                    )}
                  </h5>
                </div>
                <div className="mb-4">
                  <ResourceBadge type={resource.type} />
                </div>
                {resource.author && (
                  <p className="text-sm text-gray-400 mb-4 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {resource.author}
                  </p>
                )}
                <p className="text-sm text-gray-300 leading-relaxed group-hover/resource:text-gray-200 transition-colors">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Topics */}
        {topic.relatedTopics && topic.relatedTopics.length > 0 && (
          <div className="mt-10 pt-10 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-400">
              <span className="font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Related Topics:
              </span>
              {topic.relatedTopics.map((related, idx) => (
                <span key={idx} className="bg-gradient-to-r from-white/[0.1] to-white/[0.05] px-5 py-2.5 rounded-full hover:from-white/[0.15] hover:to-white/[0.08] transition-all duration-300 cursor-default border border-white/10 hover:border-white/20 text-gray-300 hover:text-white">
                  {related}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Section component - Beautifully displayed, NO COLLAPSING
const SectionBlock = ({ section, isFirstSection }: {
  section: LearningSection;
  isFirstSection: boolean;
}) => {
  return (
    <section id={section.id} className={`${isFirstSection ? '' : 'mt-20 md:mt-24 lg:mt-28'} scroll-mt-24`}>
      {/* Section Header */}
      <div className="mb-12 md:mb-14 lg:mb-16 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 md:gap-6 lg:gap-8 p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl bg-gradient-to-r from-netflix-red/15 via-purple-500/8 to-transparent border border-white/20 backdrop-blur-sm mb-6 md:mb-8 shadow-xl">
          <span className="text-5xl md:text-6xl lg:text-7xl">{section.icon}</span>
          <div className="text-center sm:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent mb-2">
              {section.title}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-300">{section.subtitle}</p>
          </div>
        </div>

        <p className="text-gray-200 text-base md:text-lg lg:text-xl leading-relaxed font-light max-w-4xl mx-auto">
          {section.overview}
        </p>
      </div>

      {/* Topics Grid */}
      <div className="grid gap-10 md:gap-12 lg:gap-14">
        {section.topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </section>
  );
};


// Main page component
const LearnPage = () => {
  const [activeSection, setActiveSection] = useState(allSections[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sections based on search query
  const filteredSections = searchQuery
    ? allSections.map(section => ({
        ...section,
        topics: section.topics.filter(topic =>
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.keyPoints.some(point => point.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(section => section.topics.length > 0)
    : allSections;

  // Update active section based on scroll
  const handleScroll = () => {
    const sections = allSections.map(s => document.getElementById(s.id));
    const scrollPosition = window.scrollY + 200;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section && section.offsetTop <= scrollPosition) {
        setActiveSection(allSections[i].id);
        break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-netflix-red/15 via-purple-500/5 to-netflix-black pt-24 md:pt-28 lg:pt-32 pb-16 md:pb-20 lg:pb-24 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-20 left-20 w-96 h-96 bg-netflix-red/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-white/5 to-transparent rounded-full"></div>
        </div>

        <div className="container relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-block mb-4 md:mb-5">
              <span className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-netflix-red/20 to-purple-500/20 text-white text-xs md:text-sm font-bold rounded-full border border-white/20 backdrop-blur-sm">
                World-Class Educational Resource
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-5 tracking-tight leading-tight">
              Sound & Music
              <br />
              <span className="bg-gradient-to-r from-netflix-red via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Education Center
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 md:mb-10 lg:mb-12 leading-relaxed font-light max-w-3xl mx-auto">
              Explore the profound science of sound, music, and consciousness
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 md:mb-10 lg:mb-12">
              <div className="text-center bg-gradient-to-br from-netflix-red/15 to-transparent backdrop-blur-md rounded-2xl md:rounded-3xl px-8 py-6 md:px-10 md:py-8 border border-white/20 hover:scale-105 transition-transform duration-300">
                <p className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-netflix-red to-pink-500 bg-clip-text text-transparent mb-2">
                  {learningCenterStats.totalSections}
                </p>
                <p className="text-xs md:text-sm text-gray-300 font-bold uppercase tracking-wider">Disciplines</p>
              </div>

              <div className="text-center bg-gradient-to-br from-purple-500/15 to-transparent backdrop-blur-md rounded-2xl md:rounded-3xl px-8 py-6 md:px-10 md:py-8 border border-white/20 hover:scale-105 transition-transform duration-300">
                <p className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  {learningCenterStats.totalTopics}
                </p>
                <p className="text-xs md:text-sm text-gray-300 font-bold uppercase tracking-wider">Topics</p>
              </div>

              <div className="text-center bg-gradient-to-br from-pink-500/15 to-transparent backdrop-blur-md rounded-2xl md:rounded-3xl px-8 py-6 md:px-10 md:py-8 border border-white/20 hover:scale-105 transition-transform duration-300">
                <p className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                  {learningCenterStats.totalResources}
                </p>
                <p className="text-xs md:text-sm text-gray-300 font-bold uppercase tracking-wider">Resources</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search topics and concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl md:rounded-2xl px-6 py-4 md:px-8 md:py-5 pl-12 md:pl-14 text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red focus:ring-4 focus:ring-netflix-red/20 transition-all duration-300 text-base md:text-lg shadow-lg hover:border-white/30"
              />
              <svg
                className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors hover:scale-110"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Bar */}
      <div className="sticky top-16 z-30 bg-netflix-black/95 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="container py-4 md:py-5 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 md:gap-3 justify-center flex-wrap">
            {allSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-netflix-red to-purple-500 text-white shadow-lg scale-105'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-2xl">{section.icon}</span>
                <span>{section.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12 md:py-16 lg:py-20">
        <div className="w-full">
          {searchQuery && filteredSections.length === 0 ? (
            <div className="text-center py-32">
              <div className="inline-block p-10 bg-gradient-to-br from-netflix-red/10 to-purple-500/10 rounded-3xl mb-10 border border-white/10">
                <svg className="w-24 h-24 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-400 text-2xl mb-4">No results found for</p>
              <p className="text-white text-3xl font-bold mb-12">"{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-10 py-5 bg-gradient-to-r from-netflix-red to-purple-500 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredSections.map((section, index) => (
              <SectionBlock
                key={section.id}
                section={section}
                isFirstSection={index === 0}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative bg-gradient-to-t from-netflix-red/20 via-purple-500/10 to-transparent py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-netflix-red/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container text-center relative z-10">
          <div>
            <div className="mb-12">
              <span className="text-8xl">🎵</span>
            </div>

            <h3 className="text-6xl lg:text-7xl font-bold text-white mb-10">
              Continue Your
              <br />
              <span className="bg-gradient-to-r from-netflix-red via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Learning Journey
              </span>
            </h3>

            <p className="text-gray-200 mb-16 text-2xl leading-relaxed font-light">
              Explore our other sections to deepen your understanding of sound's transformative power
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="/frequencies"
                className="group px-12 py-7 bg-gradient-to-r from-netflix-red/20 to-transparent border-2 border-white/20 text-white rounded-2xl font-bold flex items-center gap-4 hover:border-netflix-red/40 hover:scale-105 transition-all duration-300 backdrop-blur-sm text-xl hover:shadow-xl hover:shadow-netflix-red/10"
              >
                <span className="text-4xl group-hover:scale-125 transition-transform">🔊</span>
                <span>Frequencies</span>
              </a>

              <a
                href="/sound-healing"
                className="group px-12 py-7 bg-gradient-to-r from-purple-500/20 to-transparent border-2 border-white/20 text-white rounded-2xl font-bold flex items-center gap-4 hover:border-purple-500/40 hover:scale-105 transition-all duration-300 backdrop-blur-sm text-xl hover:shadow-xl hover:shadow-purple-500/10"
              >
                <span className="text-4xl group-hover:scale-125 transition-transform">🧘</span>
                <span>Sound Healing</span>
              </a>

              <a
                href="/research"
                className="group px-12 py-7 bg-gradient-to-r from-pink-500/20 to-transparent border-2 border-white/20 text-white rounded-2xl font-bold flex items-center gap-4 hover:border-pink-500/40 hover:scale-105 transition-all duration-300 backdrop-blur-sm text-xl hover:shadow-xl hover:shadow-pink-500/10"
              >
                <span className="text-4xl group-hover:scale-125 transition-transform">📚</span>
                <span>Research</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
