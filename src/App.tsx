import { useState } from "react";
import "./App.css";
import { BrazilTaxCalculator } from "./taxCalculator/brazilTaxCalculator";
import { Currency } from "./currency";

const DUTY_RATE_UP_TO_50 = 0.2;
const DUTY_RATE_ABOVE_50 = 0.6;
const DUTY_DISCOUNT = 20;
const ICMS_RATE = 0.17;

function dutyBreakdown(cost: number, duty: number, isRemessaConforme: boolean) {
  const dutyRate =
    cost <= 50 && isRemessaConforme ? DUTY_RATE_UP_TO_50 : DUTY_RATE_ABOVE_50;

  return (
    <code>
      Duty = {cost} × {dutyRate} {isRemessaConforme && `- ${DUTY_DISCOUNT}`} ={" "}
      <strong>{duty}</strong>
    </code>
  );
}

function icmsBreakdown(totalWithDuty: number, icms: number) {
  return (
    <code>
      ICMS = {totalWithDuty} / (1 - {ICMS_RATE}) × {ICMS_RATE} ={" "}
      <strong>{icms}</strong>
    </code>
  );
}

function App() {
  const [country, setCountry] = useState("");
  const [cost, setCost] = useState("0");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isRemessaConforme, setIsRemessaConforme] = useState(true);
  const taxBreakdown = new BrazilTaxCalculator().get(
    Number(cost) ?? 0,
    isRemessaConforme
  );

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters
    let digits = e.target.value.replace(/\D/g, "");

    // If less than 3 digits, pad with leading zeros
    if (digits.length < 3) {
      digits = digits.padStart(3, "0");
    }

    // Insert comma before last two digits
    const integerPart = digits.slice(0, -2);
    const decimalPart = digits.slice(-2);

    setCost(`${parseInt(integerPart, 10)}.${decimalPart}`);
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-sm space-y-5">
        <h1 className="text-center text-2xl font-semibold text-gray-900">
          Import Duty Calculator
        </h1>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#f9f9f9] border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="brazil" className="text-xl">
              🇧🇷 Brazil
            </option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">
            Item Cost (USD)
          </label>
          <input
            value={cost}
            type="tel"
            onChange={handleCostChange}
            placeholder="0"
            className="w-full px-4 py-3 rounded-xl bg-[#f9f9f9] border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={isRemessaConforme}
              onChange={(e) => setIsRemessaConforme(e.target.checked)}
            />
            Remessa Conforme
          </label>
        </div>

        <div className="mt-4 space-y-3">
          <div className={`text-sm text-gray-700${cost ? "" : " invisible"}`}>
            <div className="flex gap-4 items-center">
              <div>
                <div>
                  <strong>Duty:</strong> <Currency value={taxBreakdown.duty} />
                </div>
                <div>
                  <strong>ICMS:</strong> <Currency value={taxBreakdown.icms} />
                </div>
              </div>
              <div className="text-gray-400 flex-grow">
                = <Currency value={taxBreakdown.duty + taxBreakdown.icms} />
              </div>
              <button
                className="text-blue-700"
                onClick={() => setShowBreakdown((v) => !v)}
              >
                Breakdown {showBreakdown ? <>&#9650;</> : <>&#9660;</>}
              </button>
            </div>
            <div
              className={`grid transition-all ${showBreakdown ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden flex flex-col">
                {dutyBreakdown(
                  Number(cost),
                  taxBreakdown.duty,
                  isRemessaConforme
                )}
                {icmsBreakdown(
                  Number(cost) + taxBreakdown.duty,
                  taxBreakdown.icms
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 mb-0 text-center text-lg font-medium text-green-700 bg-green-100 rounded-xl py-3">
            <div>
              <strong>Total:</strong> <Currency value={taxBreakdown.total} />
            </div>
          </div>
          <small
            className={`text-gray-400 text-xs text-right ${taxBreakdown.total === 0 ? "invisible" : ""}`}
          >
            ≈{" "}
            <Currency
              value={
                ((taxBreakdown.duty + taxBreakdown.icms) / Number(cost)) * 100
              }
            />
            % tax
          </small>
        </div>
      </div>
    </div>
  );
}

export default App;
