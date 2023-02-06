import { useEffect, useState } from "react";
import { ILCELER, ILLER, PAGE_SIZE } from "./constants";

type Entry = {
  id: number | string;
  description: string;
  city: string;
  district: string;
  number?: string;
};

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [description, setDescription] = useState("");
  const [selectedCity, setSelectedCity] = useState("Adana");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [filter, setFilter] = useState({ city: "", district: "" });
  const [number, setNumber] = useState("");

  const [paging, setPaging] = useState(1);

  function submitData() {
    const data = {
      description,
      city: selectedCity,
      district: selectedDistrict,
      number,
    } as Entry;
    if (data.city && data.district && data.description) {
      fetch("https://deprem.noonlordhost.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          alert("Mesajınız başarıyla gönderildi!");
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Mesajınız gönderilirken bir hata oluştu!");
        });
    } else {
      alert("Lütfen tüm alanları doldurunuz");
    }
  }

  // get entries from backend
  useEffect(() => {
    const URL = "https://deprem.noonlordhost.com/";
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setEntries(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-secondary-black font-roboto">
      <header className="text-center text-slate-200 text-5xl mt-4">
        DEPREM YARDIM
      </header>
      <form className="flex flex-col items-center mt-4">
        <textarea
          className="w-64 h-24 rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
          placeholder="Mesajınız*"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={280}
          rows={4}
        />
        <label
          htmlFor="cities"
          className="text-slate-200 text-center mt-2 text-base"
        >
          İl*
        </label>
        <select
          id="countries"
          className=" w-64 h-10 rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {ILLER.map((il) => (
            <option key={il.key} value={il.text}>
              {il.text}
            </option>
          ))}
        </select>
        <label
          htmlFor="districts"
          className="text-slate-200 text-center mt-2 text-base"
        >
          İlçe*
        </label>
        <select
          id="districts"
          className=" w-64 h-10 rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
        >
          {ILCELER.filter((ilce) => ilce.il == selectedCity).map((ilce) => (
            <option key={ilce.ilce_id} value={ilce.ilce}>
              {ilce.ilce}
            </option>
          ))}
        </select>
        <label
          htmlFor="number"
          className="text-slate-200 text-center mt-2 text-base"
        >
          İletişim
        </label>
        <input
          id="number"
          placeholder="53..."
          className="w-64 h-10 rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button
          className="w-40 h-10 font-bold rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black mt-4  placeholder:text-center placeholder:text-slate-200 hover:scale-95 transition"
          onClick={submitData}
        >
          Gönder
        </button>
      </form>
      <div className="flex flex-col items-center mt-4">
        <div className="flex flex-row items-center">
          <div className="flex flex-col">
            <label
              htmlFor="cities"
              className="text-slate-200 text-center mt-2 text-base"
            >
              İl
            </label>
            <select
              id="cities"
              className=" w-32 mr-2 h-10 rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
              value={filter.city}
              onChange={(e) => setFilter({ ...filter, city: e.target.value })}
            >
              <option value="">Tümü</option>
              {ILLER.map((il) => (
                <option key={il.key} value={il.text}>
                  {il.text}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="districts"
              className="text-slate-200 text-center mt-2 text-base"
            >
              İlçe
            </label>
            <select
              id="districts"
              className=" w-32 h-10 rounded-md border-2  text-center border-slate-100 text-slate-100 bg-secondary-black  placeholder:text-center placeholder:text-slate-300/40"
              value={filter.district}
              onChange={(e) =>
                setFilter({ ...filter, district: e.target.value })
              }
            >
              <option value="">Tümü</option>
              {ILCELER.filter((ilce) => ilce.il == filter.city).map((ilce) => (
                <option key={ilce.ilce_id} value={ilce.ilce}>
                  {ilce.ilce}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid gap-6 row-gap-5 px-16 py-6 lg:grid-cols-5 sm:row-gap-6 sm:grid-cols-3">
        {entries.length > 0 &&
          entries
            .filter((entry) => {
              if (filter.city === "" && filter.district === "") {
                return true;
              } else if (filter.city !== "" && filter.district === "") {
                return entry.city === filter.city;
              } else if (filter.city !== "" && filter.district !== "") {
                return (
                  entry.city === filter.city &&
                  entry.district === filter.district
                );
              }
            })
            .slice((paging - 1) * PAGE_SIZE, paging * PAGE_SIZE)
            .map((entry) => (
              <div
                className="relative overflow-hidden transition duration-200 transform rounded shadow-lg hover:-translate-y-2 hover:shadow-2x"
                key={entry.id}
              >
                <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-gradient-to-r from-yellow-400 to-red-500 opacity-75"></div>
                <div className="relative px-4 py-4 bg-black">
                  <p className="text-sm font-medium text-white">
                    {entry.description}
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-300">
                    {entry.city} / {entry.district}
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-400">
                    {entry.number}
                  </p>
                </div>
              </div>
            ))}
      </div>
      <div className="flex flex-row justify-center mb-4">
        {entries.length > 0
          ? Array.from(
              { length: Math.ceil(entries.length / PAGE_SIZE) },
              (v, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                className={`rounded-md border-2 w-12 h-12 border-slate-800 bg-slate-50  font-semibold text-slate-800 transition-all p-2 m-2 ${
                  paging === page
                    ? "bg-slate-300"
                    : "hover:bg-slate-400 transition-all"
                }`}
              >
                {page}
              </button>
            ))
          : null}
      </div>
    </div>
  );
}

export default App;
