"use server";

import Header from "@/components/home/Header";
import PageHeader from "@/components/home/PageHeader";
import Footer from "@/components/home/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPastSponsors } from "@/lib/actions/sponsorActions";

const Sponsors = async () => {
  const pastSponsors = await getPastSponsors();

  return (
    <>
      <Header />
      <PageHeader pageTitle="Past Sponsors" />

      <section id="Sponsors" className="bg-gray-100 py-5">
        {pastSponsors.length > 0 ? (
          pastSponsors.map((item, index) => {
            return (
              <Card className="mx-4 my-4 rounded-3xl">
                <CardHeader>
                  <CardTitle key="index" className="text-center">
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="md:columns-2 text-md">
                    {item.sponsors.map((sponsor, sponIndex) => {
                      return <li key="sponIndex">{sponsor}</li>;
                    })}
                  </ul>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="mx-4 my-2 rounded-xl">
            <CardContent className="text-center">
              No past sponsors exist for this event.
            </CardContent>
          </Card>
        )}
      </section>
      <Footer />
    </>
  );
};

export default Sponsors;
