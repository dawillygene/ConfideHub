import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './resource.css';

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState('mental-health');
  const [resourceForm, setResourceForm] = useState({
    name: '',
    type: 'Website',
    description: ''
  });

  const categories = [
    { id: 'mental-health', label: 'Mental Health' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'career', label: 'Career Stress' },
    { id: 'family', label: 'Family Issues' },
    { id: 'lgbtq', label: 'LGBTQ+ Safe Space' }
  ];

  const resourcesData = {
    'mental-health': {
      cards: [
        {
          icon: 'fa-brain',
          title: 'Understanding Anxiety',
          description: 'Learn about anxiety disorders, symptoms, and coping strategies from mental health experts.',
          link: '#'
        },
        {
          icon: 'fa-heart',
          title: 'Depression Resources',
          description: 'Find information, treatment options, and support groups for depression and related conditions.',
          link: '#'
        },
        {
          icon: 'fa-balance-scale',
          title: 'Stress Management',
          description: 'Practical techniques and exercises to help manage and reduce stress in your daily life.',
          link: '#'
        }
      ],
      organizations: [
        { name: 'World Health Organization (WHO) - Mental Health', link: '#' },
        { name: 'Mental Health Foundation', link: '#' },
        { name: 'National Alliance on Mental Illness (NAMI)', link: '#' },
        { name: 'Tanzania Mental Health Association', link: '#' }
      ]
    },
    'relationships': {
      cards: [
        {
          icon: 'fa-hands-helping',
          title: 'Healthy Relationships',
          description: 'Guides and resources for building and maintaining healthy, supportive relationships.',
          link: '#'
        },
        {
          icon: 'fa-heart-broken',
          title: 'Coping with Breakups',
          description: 'Support resources and guidance for navigating the end of relationships in healthy ways.',
          link: '#'
        },
        {
          icon: 'fa-comments',
          title: 'Communication Skills',
          description: 'Learn effective communication techniques to improve personal and professional relationships.',
          link: '#'
        }
      ],
      organizations: [
        { name: 'The Gottman Institute', link: '#' },
        { name: 'Love Is Respect (Domestic Violence Support)', link: '#' },
        { name: 'Relationship Foundation of Tanzania', link: '#' }
      ]
    },
    'career': {
      cards: [
        {
          icon: 'fa-briefcase',
          title: 'Workplace Stress Management',
          description: 'Effective techniques for managing and reducing stress in professional environments.',
          link: '#'
        },
        {
          icon: 'fa-balance-scale-right',
          title: 'Work-Life Balance',
          description: 'Resources for creating a healthier balance between work responsibilities and personal life.',
          link: '#'
        },
        {
          icon: 'fa-user-graduate',
          title: 'Career Development',
          description: 'Support for career growth, job searching, and professional development opportunities.',
          link: '#'
        }
      ],
      organizations: [
        { name: 'International Labour Organization (ILO)', link: '#' },
        { name: 'Tanzania Employment Services Agency', link: '#' },
        { name: 'LinkedIn Learning Career Resources', link: '#' }
      ]
    },
    'family': {
      cards: [
        {
          icon: 'fa-home',
          title: 'Family Counseling Resources',
          description: 'Information about family therapy and counseling services for various family challenges.',
          link: '#'
        },
        {
          icon: 'fa-child',
          title: 'Parenting Support',
          description: 'Resources and guidance for parents navigating the challenges of raising children.',
          link: '#'
        },
        {
          icon: 'fa-users',
          title: 'Family Conflict Resolution',
          description: 'Techniques and resources for resolving conflicts and improving family communication.',
          link: '#'
        }
      ],
      organizations: [
        { name: 'Family Lives (Support Helpline)', link: '#' },
        { name: 'Tanzania Family Organization', link: '#' },
        { name: 'International Family Therapy Association', link: '#' }
      ]
    },
    'lgbtq': {
      cards: [
        {
          icon: 'fa-rainbow',
          title: 'LGBTQ+ Crisis Support',
          description: 'Crisis intervention resources specifically for LGBTQ+ individuals experiencing mental health challenges.',
          link: '#'
        },
        {
          icon: 'fa-hands-helping',
          title: 'Coming Out Resources',
          description: 'Support and guidance for individuals navigating the coming out process and identity affirmation.',
          link: '#'
        },
        {
          icon: 'fa-globe-africa',
          title: 'LGBTQ+ Resources in Tanzania',
          description: 'Local and international support options for LGBTQ+ individuals in Tanzania and East Africa.',
          link: '#'
        }
      ],
      organizations: [
        { name: 'The Trevor Project (Crisis Intervention)', link: '#' },
        { name: 'ILGA (International Lesbian, Gay, Bisexual, Trans and Intersex Association)', link: '#' },
        { name: 'Pan Africa ILGA', link: '#' }
      ]
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setResourceForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Resource suggestion submitted:', resourceForm);
    // Reset form after submission
    setResourceForm({ name: '', type: 'Website', description: '' });
  };

  return (
    <>
    
      <main className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-6">Support Resources</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We've compiled a comprehensive collection of resources to support your mental health and well-being. Whether you're facing a crisis or simply looking for ways to improve your daily life, you'll find helpful information and support options here.
          </p>
        </section>

        {/* Emergency Resources Section */}
        <section id="emergency" className="mb-16">
          <div className="emergency-banner p-4 rounded-lg mb-8 shadow-lg">
            <div className="flex items-center">
              <div className="mr-4 text-3xl">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold">Need immediate help?</h2>
                <p>If you or someone you know is in crisis, please use these emergency resources right away.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hotline-card">
              <h3 className="text-xl font-bold mb-2">International Suicide Prevention</h3>
              <p className="text-gray-600 mb-4">24/7 crisis support for those experiencing suicidal thoughts</p>
              <div className="flex items-center mb-3">
                <i className="fas fa-phone text-tertiary mr-2"></i>
                <span className="font-bold">1-800-273-8255</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-globe text-tertiary mr-2"></i>
                <Link to="#" className="text-primary underline">befrienders.org</Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hotline-card">
              <h3 className="text-xl font-bold mb-2">Crisis Text Line</h3>
              <p className="text-gray-600 mb-4">Text-based crisis support available 24/7</p>
              <div className="flex items-center mb-3">
                <i className="fas fa-comment-alt text-tertiary mr-2"></i>
                <span className="font-bold">Text HOME to 741741</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-globe text-tertiary mr-2"></i>
                <Link to="#" className="text-primary underline">crisistextline.org</Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hotline-card">
              <h3 className="text-xl font-bold mb-2">Tanzania Depression Support</h3>
              <p className="text-gray-600 mb-4">Mental health support services in Tanzania</p>
              <div className="flex items-center mb-3">
                <i className="fas fa-phone text-tertiary mr-2"></i>
                <span className="font-bold">+255 744 466 869</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-globe text-tertiary mr-2"></i>
                <Link to="#" className="text-primary underline">tanzaniadepressionfoundation.org</Link>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
            <h3 className="text-xl font-bold mb-2">Confidential Resources</h3>
            <p className="text-gray-600">
              All communication with these resources is confidential. Your information and identity will be protected. If you're in immediate physical danger, please contact your local emergency services by dialing <span className="font-bold">911</span> (US) or <span className="font-bold">112</span> (most of Europe) or <span className="font-bold">999</span> (Tanzania).
            </p>
          </div>
        </section>

        {/* Categorized Resources Section */}
        <section id="categories" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 gradient-heading">Find Support By Category</h2>

          <div className="flex flex-wrap border-b border-gray-200 mb-8">
            {categories.map(category => (
              <div
                key={category.id}
                className={`category-tab px-4 py-2 text-lg ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.label}
              </div>
            ))}
          </div>

          <div className="resource-content active">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourcesData[activeCategory].cards.map((card, index) => (
                <div key={index} className="resource-card bg-white">
                  <div className={`h-40 bg-${['primary', 'secondary', 'tertiary'][index % 3]} flex items-center justify-center`}>
                    <i className={`fas ${card.icon} text-white text-5xl`}></i>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                    <p className="text-gray-600 mb-4">{card.description}</p>
                    <Link to={card.link} className="btn-tertiary px-4 py-2 rounded inline-block">Learn More</Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-lg font-bold mb-2">Organizations & Support Groups</h4>
              <ul className="list-disc ml-6 space-y-2">
                {resourcesData[activeCategory].organizations.map((org, index) => (
                  <li key={index}>
                    <Link to={org.link} className="text-primary hover:underline">{org.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Educational Resources Section */}
        <section id="education" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 gradient-heading">Educational Resources</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-primary p-3 rounded-full mr-4">
                  <i className="fas fa-book text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-bold">Articles & Guides</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { title: 'Understanding Mental Health Basics', description: 'A comprehensive guide to mental health conditions, treatments, and wellness strategies.' },
                  { title: 'Building Emotional Resilience', description: 'Learn techniques to develop and strengthen your emotional resilience in challenging times.' },
                  { title: 'Mindfulness for Beginners', description: 'Simple mindfulness practices that can help reduce stress and improve mental well-being.' },
                  { title: 'Cultural Perspectives on Mental Health', description: 'Exploring how mental health is viewed across different cultures, including Tanzania.' }
                ].map((article, index) => (
                  <li key={index} className="border-b border-gray-100 pb-3">
                    <Link to="#" className="block hover:bg-gray-50 p-2 rounded">
                      <h4 className="font-bold text-primary">{article.title}</h4>
                      <p className="text-sm text-gray-600">{article.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="#" className="btn-secondary mt-6 px-4 py-2 rounded inline-block">View All Articles</Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-tertiary p-3 rounded-full mr-4">
                  <i className="fas fa-video text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-bold">Video Resources</h3>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Anxiety Management Techniques', description: '15-minute guided video with practical techniques for managing anxiety.' },
                  { title: 'Understanding Depression', description: 'Expert explanation of depression, its symptoms, and treatment options.' },
                  { title: 'Supporting a Loved One', description: 'How to provide effective support to someone experiencing mental health challenges.' }
                ].map((video, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3">
                    <h4 className="font-bold text-tertiary mb-2">{video.title}</h4>
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <i className="fas fa-play-circle text-5xl text-gray-400"></i>
                    </div>
                    <p className="text-sm text-gray-600">{video.description}</p>
                  </div>
                ))}
              </div>
              <Link to="#" className="btn-secondary mt-6 px-4 py-2 rounded inline-block">Browse Video Library</Link>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Recommended Books</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: 'Feeling Good', author: 'David D. Burns', subtitle: 'The New Mood Therapy' },
                { title: 'The Gifts of Imperfection', author: 'Brené Brown', subtitle: "Let Go of Who You Think You're Supposed to Be" },
                { title: "Man's Search for Meaning", author: 'Viktor E. Frankl', subtitle: 'Finding Purpose in Difficult Times' }
              ].map((book, index) => (
                <div key={index} className="flex">
                  <div className="w-16 h-24 bg-gray-300 rounded flex-shrink-0 mr-3"></div>
                  <div>
                    <h4 className="font-bold">{book.title}</h4>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <p className="text-xs text-gray-500 mt-1">{book.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Self-Help Tools Section */}
        <section id="tools" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 gradient-heading">Self-Help Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'fa-chart-line', color: 'primary', title: 'Mood Tracker', description: 'Track your daily mood patterns to identify triggers and improvements over time.', extra: 'Private and anonymous', extraIcon: 'fa-lock', link: '#' },
              { icon: 'fa-spa', color: 'secondary', title: 'Guided Meditation', description: 'Access free guided meditations ranging from 2-30 minutes for stress relief and mindfulness.', extra: 'Audio and text versions available', extraIcon: 'fa-headphones', link: '#' },
              { icon: 'fa-book-open', color: 'tertiary', title: 'Journal Prompts', description: 'Thought-provoking prompts to help process emotions and gain personal insights through writing.', extra: 'New prompts daily', extraIcon: 'fa-random', link: '#' },
              { icon: 'fa-toolbox', color: 'primary', title: 'Anxiety Toolkit', description: 'Quick access to grounding techniques, breathing exercises, and distraction methods.', extra: 'Used by 10,000+ members', extraIcon: 'fa-heart', link: '#' },
              { icon: 'fa-moon', color: 'secondary', title: 'Sleep Improvement', description: 'Resources and techniques to improve sleep quality, including sleep meditations and bedtime routines.', extra: 'Evidence-based techniques', extraIcon: 'fa-clock', link: '#' },
              { icon: 'fa-list-alt', color: 'tertiary', title: 'Coping Skills Library', description: 'Searchable database of healthy coping mechanisms for different emotional challenges.', extra: '100+ strategies available', extraIcon: 'fa-search', link: '#' }
            ].map((tool, index) => (
              <div key={index} className="resource-card bg-white overflow-visible">
                <div className={`h-12 bg-${tool.color} rounded-t-lg relative`}>
                  <div className="absolute -bottom-8 left-6 bg-white p-3 rounded-full shadow-lg">
                    <i className={`fas ${tool.icon} text-${tool.color} text-2xl`}></i>
                  </div>
                </div>
                <div className="p-6 pt-12">
                  <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <i className={`fas ${tool.extraIcon} mr-2`}></i>
                    <span>{tool.extra}</span>
                  </div>
                  <Link to={tool.link} className="btn-primary px-4 py-2 rounded inline-block">{tool.title.split(' ')[0]} {tool.title.split(' ')[1]}</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Support Section */}
        <section id="professional" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 gradient-heading">Professional Support</h2>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-bold mb-4">Finding the Right Professional Help</h3>
            <p className="text-gray-600 mb-4">
              While peer support and self-help tools are valuable, sometimes professional assistance is needed. Here are resources to help you find appropriate professional support.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-bold mb-2">Types of Mental Health Professionals</h4>
                <ul className="list-disc ml-6 space-y-1 text-gray-600">
                  <li>Psychiatrists (medical doctors who can prescribe medication)</li>
                  <li>Psychologists (provide therapy and psychological testing)</li>
                  <li>Licensed Counselors and Therapists</li>
                  <li>Social Workers</li>
                  <li>Psychiatric Nurses</li>
                </ul>
              </div>
              <div className="border-l-4 border-tertiary pl-4">
                <h4 className="font-bold mb-2">When to Seek Professional Help</h4>
                <ul className="list-disc ml-6 space-y-1 text-gray-600">
                  <li>Persistent feelings of sadness or anxiety</li>
                  <li>Difficulty functioning in daily life</li>
                  <li>Thoughts of harming yourself or others</li>
                  <li>Substance use concerns</li>
                  <li>Major life transitions or trauma</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: 'fa-user-md', color: 'primary', title: 'Find a Therapist', description: 'Search for mental health professionals in your area or offering online services.', link: '#', btn: 'primary' },
              { icon: 'fa-laptop', color: 'secondary', title: 'Online Therapy', description: 'Connect with licensed therapists through secure video, phone, or messaging.', link: '#', btn: 'secondary' },
              { icon: 'fa-hand-holding-heart', color: 'tertiary', title: 'Affordable Options', description: 'Resources for low-cost or free mental health services in Tanzania and globally.', link: '#', btn: 'tertiary' }
            ].map((option, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4 text-center">
                  <div className={`inline-block p-3 rounded-full bg-${option.color} bg-opacity-10`}>
                    <i className={`fas ${option.icon} text-${option.color} text-3xl`}></i>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">{option.title}</h3>
                <p className="text-gray-600 mb-4 text-center">{option.description}</p>
                <Link to={option.link} className={`btn-${option.btn} w-full py-2 rounded text-center block`}>{option.title.split(' ')[0]} {option.title.split(' ')[1]}</Link>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Therapy FAQ</h3>
            <div className="space-y-4">
              {[
                { question: 'What should I expect in my first therapy session?', answer: 'Your first session typically involves discussing your background, current concerns, and treatment goals. The therapist will explain their approach and answer your questions.' },
                { question: 'How do I know if therapy is working?', answer: 'Progress in therapy often includes feeling better understood, gaining new insights, developing better coping skills, and seeing positive changes in your thoughts, feelings, and behaviors.' },
                { question: 'Is therapy confidential?', answer: 'Yes, with limited exceptions. Therapists maintain confidentiality except in cases where there is risk of harm to yourself or others, or when required by law (such as suspected abuse of a child or vulnerable adult).' }
              ].map((faq, index) => (
                <div key={index}>
                  <h4 className="font-bold text-primary">{faq.question}</h4>
                  <p className="text-gray-600 mt-1">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Personalized Recommendations Section */}
        <section className="mb-16">
          <div className="recommendation-card p-6 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                <i className="fas fa-lightbulb text-yellow-300 text-5xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Personalized Recommendations</h2>
                <p className="mb-4">
                  Based on the confessions and topics you've engaged with, we can provide tailored resources that may be helpful for your specific situation.
                </p>
                <button className="bg-white text-primary font-bold px-6 py-2 rounded shadow-md hover:bg-gray-100 transition duration-300">
                  Get Recommendations
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Resources Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 gradient-heading">Additional Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Recommended Apps</h3>
              <div className="space-y-4">
                {[
                  { icon: 'fa-brain', color: 'blue-500', title: 'Calm', description: 'Meditation and sleep stories to reduce stress and anxiety' },
                  { icon: 'fa-smile', color: 'green-500', title: 'Headspace', description: 'Guided meditation and mindfulness techniques' },
                  { icon: 'fa-journal-whills', color: 'purple-500', title: 'Daylio', description: 'Mood tracking and journaling app' }
                ].map((app, index) => (
                  <div key={index} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className={`w-12 h-12 bg-${app.color} rounded-lg flex items-center justify-center mr-4`}>
                      <i className={`fas ${app.icon} text-white`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold">{app.title}</h4>
                      <p className="text-sm text-gray-600">{app.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Mental Health Podcasts</h3>
              <div className="space-y-4">
                {[
                  { icon: 'fa-podcast', color: 'red-500', title: 'The Happiness Lab', description: 'Science-based approaches to happiness and well-being' },
                  { icon: 'fa-podcast', color: 'indigo-500', title: 'Unlocking Us', description: 'Brené Brown explores human connection and emotions' },
                  { icon: 'fa-podcast', color: 'yellow-500', title: 'Mentally Yours', description: 'Open discussions about mental health experiences' }
                ].map((podcast, index) => (
                  <div key={index} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className={`w-12 h-12 bg-${podcast.color} rounded-lg flex items-center justify-center mr-4`}>
                      <i className={`fas ${podcast.icon} text-white`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold">{podcast.title}</h4>
                      <p className="text-sm text-gray-600">{podcast.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="mb-16">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Suggest a Resource</h3>
            <p className="text-gray-600 mb-6">
              Know of a helpful resource that should be included here? Let us know! We're constantly updating our resource collection based on community recommendations.
            </p>
            <div>
              <div className="mb-4">
                <label htmlFor="resource-name" className="block text-gray-700 font-medium mb-2">Resource Name</label>
                <input
                  type="text"
                  id="resource-name"
                  name="name"
                  value={resourceForm.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="resource-type" className="block text-gray-700 font-medium mb-2">Resource Type</label>
                <select
                  id="resource-type"
                  name="type"
                  value={resourceForm.type}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Website</option>
                  <option>Book</option>
                  <option>App</option>
                  <option>Hotline</option>
                  <option>Organization</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="resource-description" className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  id="resource-description"
                  name="description"
                  rows="3"
                  value={resourceForm.description}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>
              <button
                onClick={handleFormSubmit}
                className="btn-primary px-6 py-2 rounded"
              >
                Submit Resource
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Resources;