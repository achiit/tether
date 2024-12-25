import React from "react";

const Referrals = () => {
  // Sample referral data
  const referralData = [
    {
      id: 1,
      address: "12378",
      activationDate: "2024-01-01",
      level: "Gold",
      directTeam: 10,
    },
    {
      id: 2,
      address: "45689",
      activationDate: "2024-02-15",
      level: "Silver",
      directTeam: 8,
    },
    {
      id: 3,
      address: "78945",
      activationDate: "2024-03-10",
      level: "Platinum",
      directTeam: 12,
    },
    {
      id: 4,
      address: "16234",
      activationDate: "2024-04-25",
      level: "Gold",
      directTeam: 7,
    },
    {
      id: 5,
      address: "47589",
      activationDate: "2024-05-05",
      level: "Diamond",
      directTeam: 15,
    },
  ];

  return (
    <div className="drop-shadow-lg p-4 bg-white lg:rounded-lg">
      <div className="overflow-x-auto text-nowrap">
        <table className="w-full">
          <thead>
            <tr>
              <th className="bg-yellow-200 py-2 px-4 text-left">S.No</th>
              <th className="bg-yellow-200 py-2 px-4 text-left">ID</th>
              <th className="bg-yellow-200 py-2 px-4 text-left">Address</th>
              <th className="bg-yellow-200 py-2 px-4 text-left">
                Activation Date
              </th>
              <th className="bg-yellow-200 py-2 px-4 text-left">Level</th>
              <th className="bg-yellow-200 py-2 px-4 text-left">
                Direct Team
              </th>
            </tr>
          </thead>
          <tbody>
            {referralData.map((referral, index) => (
              <tr
                key={referral.id}
                className={index % 2 === 0 ? "hover:bg-gray-50 border-b" : "hover:bg-gray-50 border-b"}
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{referral.id}</td>
                <td className="py-2 px-4">{referral.address}</td>
                <td className="py-2 px-4">
                  {referral.activationDate}
                </td>
                <td className="py-2 px-4">{referral.level}</td>
                <td className="py-2 px-4">
                  {referral.directTeam}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {referralData.length === 0 && (
          <p className="text-gray-500 text-center mt-4">
            No referral data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Referrals;
