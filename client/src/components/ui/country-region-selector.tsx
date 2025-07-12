import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { COUNTRIES, getRegionsForCountry } from "../../../../shared/countryData";

interface CountryRegionSelectorProps {
  selectedCountry?: string;
  selectedRegion?: string;
  onCountryChange: (country: string) => void;
  onRegionChange: (region: string) => void;
  className?: string;
}

export function CountryRegionSelector({
  selectedCountry,
  selectedRegion,
  onCountryChange,
  onRegionChange,
  className = ""
}: CountryRegionSelectorProps) {
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCountry) {
      const countryRegions = getRegionsForCountry(selectedCountry);
      setRegions(countryRegions);
      
      // Reset region if it's not valid for the new country
      if (selectedRegion && !countryRegions.includes(selectedRegion)) {
        onRegionChange("");
      }
    } else {
      setRegions([]);
      onRegionChange("");
    }
  }, [selectedCountry, selectedRegion, onRegionChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor="country-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Country *
        </Label>
        <Select value={selectedCountry} onValueChange={onCountryChange}>
          <SelectTrigger id="country-select" className="mt-1">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {COUNTRIES.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCountry && regions.length > 0 && (
        <div>
          <Label htmlFor="region-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Region/State
          </Label>
          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger id="region-select" className="mt-1">
              <SelectValue placeholder="Select your region/state" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}