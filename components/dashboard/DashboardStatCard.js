import { Card, CardContent } from "../ui/card";

const DashboardStatCard = ({ title, stat, CustomIcon, isMoney = false }) => {
  return (
    <Card>
      <CardContent className="flex justify-between p-4 items-center">
        <div id="stats">
          <p className="mb-2">{title}</p>
          <h6 className="text-4xl font-bold">
            {isMoney
              ? stat.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })
              : stat}
          </h6>
        </div>
        {<CustomIcon className="h-10 w-10" />}
      </CardContent>
    </Card>
  );
};

export default DashboardStatCard;
