import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import { PageSeo } from '@/components/SEO'

export default function About() {
  return (
    <>
      <PageSeo
        title={`About - ${siteMetadata.author}`}
        description={`About me - ${siteMetadata.author}`}
        url={`${siteMetadata.siteUrl}/about`}
      />
      <div className="divide-y">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center pt-8 space-x-2">
            <img src={siteMetadata.image} alt="avatar" className="w-48 h-48 rounded-full" />
            <h3 className="pt-4 pb-2 text-2xl font-bold leading-8 tracking-tight">
              {siteMetadata.author}
            </h3>
            <div className="text-gray-500 dark:text-gray-400">MCSD .NET Developer</div>
            <div className="text-gray-500 dark:text-gray-400">Based in Warsaw, Poland</div>
            <div className="flex pt-6 space-x-3">
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} />
              <SocialIcon kind="github" href={siteMetadata.github} />
              {/* <SocialIcon kind="facebook" href={siteMetadata.facebook} /> */}
              {/* <SocialIcon kind="youtube" href={siteMetadata.youtube} /> */}
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} />
              {/* <SocialIcon kind="twitter" href={siteMetadata.twitter} /> */}
            </div>
          </div>
          <div className="pt-8 pb-8 prose dark:prose-dark max-w-none xl:col-span-2">
            <p>
              Konrad is a .NET developer with extensive <strong>back-end and mobile</strong>{' '}
              background delivering projects from various industries like FinTech, data migration,
              legacy apps support & refactor while working for companies like{' '}
              <a href="https://www.predicagroup.com">
                Microsoft Partner Of The Year of Poland 2015, 2020
              </a>{' '}
              with good all-around knowledge about Microsoft products and services
            </p>
            <p>
              My tech stack:
              <ul>
                <li>Languages: C#, F#, SQL, PowerShell, JavaScript</li>
                <li>Frameworks: ASP.NET, Blazor, Xamarin, WPF, UWP, Svelte</li>
                <li>Tools: Azure, Linux, Active Directory, Office365</li>
                <li>Favourite NuGets: FluentAssertions, Moq, NUnit</li>
              </ul>
            </p>
            <blockquote>
              <p>
                I had a pleasure to work with Konrad for last few months. During that time Konrad
                has been always eager to learn new technologies and seek better solutions. I
                appreciate our countless discussions on how to improve team's productivity and
                project management. On top of that, he has been always willing to listen to feedback
                and implement suggestions. Besides speaking only about tech stuff, we could always
                discuss non-work related matters.
              </p>
              <cite>
                <a href="https://damianantonowicz.pl/">Damian Antonowicz, Microsoft MVP</a>
              </cite>
            </blockquote>
            <blockquote>
              <p>
                Konrad worked in Predica first as intern, than junior developer in mobile and then
                .net technologies. I was happy to be his manager for some of his time in Predica.
                His first big asset is passion. He is passionate about programming, and if you give
                him challenging projects that spark this passion, he will go to great lengths to
                deliver it and additionally spread his passion to the team. His second big asset is
                that he always came to me with questions, suggestions, did not wait for things to
                'lay around'. I really appreciated this approach as it is so rare these days with
                people - being proactive, not passive.
              </p>
              <cite>
                <a href="https://www.predicagroup.com">Andrzej Lipka, Predica Co-founder</a>
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </>
  )
}
