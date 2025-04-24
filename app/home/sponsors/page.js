import Header from "@/components/home/Header";
import PageHeader from "@/components/home/PageHeader";
import Footer from "@/components/home/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

export async function getPastSponsors() {
  const supabase = createClient();

  const { data: sponsors, error } = await supabase.rpc("get_past_donors");

  //once we have the data, group the sponsors by donation type and sort the group by the
  // cost of the donation with the highest amount being first

  //first check in the result array if a javascript object for the current donation type value exists

  // if it does do nothing, if it does not add a javascript object to the result array with
  //      the current donation name
  const sponsorsByDonationType = sponsors.reduce((result, currentValue) => {
    result.find((value) => value["name"] === currentValue["name"]) ||
      result.push({
        name: currentValue["name"],
        cost: currentValue["cost"],
        sponsors: [],
      });

    //add the current sponsor to the corresponding javascript object within the result array
    result
      .find((value) => value["name"] === currentValue["name"])
      .sponsors.push(currentValue["company_name"]);

    return result;
  }, []);

  //Sort the array of objects by donation cost from greatest to least
  sponsorsByDonationType.sort((a, b) => b.cost - a.cost);

  //Sort the arrays of sponsors for each donation type
  sponsorsByDonationType.forEach((category) => {
    category.sponsors.sort();
  });

  return sponsorsByDonationType;
}

export const revalidate = 86400; // 24 hours in seconds (ISR)

const Sponsors = async () => {
  const pastSponsors = await getPastSponsors();

  return (
    <>
      <Header />
      <PageHeader pageTitle="Past Sponsors" />

      <section id="Sponsors" className="bg-gray-100 p-5">
        {pastSponsors.length > 0 ? (
          pastSponsors.map((item, index) => {
            return (
              <Card
                key={index}
                className=" my-4 rounded-3xl max-w-[1200px] mx-auto"
              >
                <CardHeader>
                  <CardTitle className="text-center">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex w-auto justify-center">
                  <ul className="columns-2 w-[700px]">
                    {item.sponsors.map((sponsor, sponIndex) => {
                      return <li key={sponIndex}>{sponsor}</li>;
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
