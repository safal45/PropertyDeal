import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useNavigate } from "react-router-dom";
import API_BASE from "../../config";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const TABS = [
  { id: "prop-details", label: "PROPERTY DETAILS" },
  { id: "location-details", label: "LOCATION DETAILS" },
  { id: "features", label: "FEATURES & AMENITIES" },
  { id: "price-details", label: "PRICE DETAILS" },
  { id: "prop-images", label: "PROPERTY IMAGES" },
];

const PropertyForm = ({
  propertyFor,
  setPropertyFor,
  propertyType,
  setPropertyType,
  propertySubType,
  setPropertySubType,
  propertyAge,
  setPropertyAge,
  bhkType,
  setBhkType,
}) => {
  return (
    <div className="w-full p-8">
      <FormRadioGroup
        label="Property For"
        value={propertyFor}
        options={["Rent", "Sale"]}
        onChange={setPropertyFor}
        required
      />
      <FormRadioGroup
        label="Property Type"
        value={propertyType}
        options={["Residential", "Commercial", "Land/Plot"]}
        onChange={setPropertyType}
        required
      />
      {propertyType === "Residential" && (
        <FormButtonGroup
          label="Property SubType"
          options={["Flat/Apartment", "House/Villa"]}
          selectedOption={propertySubType}
          onClick={setPropertySubType}
        />
      )}
      {propertyType === "Commercial" && (
        <FormButtonGroup
          label="Property SubType"
          options={[
            "Office Space",
            "Co-working",
            "Restaurant/Cafe",
            "Industrial Building",
            "Industrial Shed",
            "Warehouse/Godown",
          ]}
          selectedOption={propertySubType}
          onClick={setPropertySubType}
        />
      )}
      <FormButtonGroup
        label="Property Age"
        options={[
          "Less than 1 Year",
          "1-3 Years",
          "3-5 Years",
          "5-10 Years",
          "Greater than 10 Years",
        ]}
        selectedOption={propertyAge}
        onClick={setPropertyAge}
        required
      />
      <FormButtonGroup
        label="BHK Type"
        options={["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"]}
        selectedOption={bhkType}
        onClick={setBhkType}
        required
      />
    </div>
  );
};

const FormButtonGroup = ({ label, options, selectedOption, onClick, required }) => (
  <div className="mb-4">
    <label className="block text-gray-700">{label}</label>
    {options.map((option) => (
      <button
        key={option}
        type="button"
        onClick={() => onClick(option)}
        className={`mr-4 h-[2.438rem] my-[10px] font-Inter font-normal text-[14px] w-auto px-[1.5rem] rounded-3xl border-[2px] ${
          selectedOption === option
            ? "bg-[#122B46] text-white"
            : "bg-white text-black"
        }`}
      >
        {option}
      </button>
    ))}
  </div>
);

const FormRadioGroup = ({ label, value, options, onChange, required }) => (
  <div className="mt-4">
    <label className="font-Inter text-[#000000D9] font-medium text-[16px]">
      <span className="text-[#FF4D4F] ml-[2px]">*</span> {label}:{" "}
    </label>{" "}
    <div className="flex w-full flex-row mt-1 ml-2 justify-between">
      {options.map((option) => (
        <div
          key={option}
          className="flex w-1/2 font-Inter font-normal text-[16px] items-center"
        >
          <input
            type="radio"
            name={label}
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="mr-4 h-[26px] w-[26px]"
            required={required}
          />
          {option}
        </div>
      ))}
    </div>
  </div>
);

const FormRadioGroup2 = ({ label, value, options, onChange }) => (
  <div className="mt-4">
    <label className="font-Inter text-[#000000D9] font-semibold text-[18px]">
      <span className="text-[#FF4D4F] ml-[2px]">*</span> {label}:
    </label>
    <div className="flex w-full flex-row mt-1 ml-2 justify-between">
      {options.map((option) => (
        <div
          key={option}
          className="flex w-1/2 font-Inter font-normal text-[16px] items-center"
        >
          <input
            type="radio"
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="mr-4 h-[26px] w-[26px]"
            required
          />
          {option}
        </div>
      ))}
    </div>
  </div>
);

const LocationEnteringGroup = ({ labels, texts, values, setters }) => (
  <div className="w-full flex flex-row justify-between text-black">
    {labels.map((label, index) => (
      <div key={`label-${index}`} className="flex flex-col justify-between">
        <label className="font-Inter font-medium mb-2 text-[16px]">
          {label}
        </label>
        <input
          type="text"
          placeholder={texts[index]}
          required
          value={values[index]}
          onChange={(e) => setters[index](e.target.value)}
          className="border border-[#D9D9D9] px-2 py-1 text-black w-[23.75rem] border-[2px] focus:outline-none"
        />
      </div>
    ))}
  </div>
);

const LocationDetails = ({
  building,
  locality,
  landmark,
  city,
  setBuilding,
  setLandmark,
  setLocality,
  setCity,
  onLatChange = null,
  onLngChange = null,
}) => {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [formData, setFormData] = useState({ building, locality, landmark, city });

  useEffect(() => {
    if (locality || city) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locality},${city}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            const { lat, lon } = data[0];
            setPosition([lat, lon]);
            if (onLatChange) onLatChange(parseFloat(lat));
            if (onLngChange) onLngChange(parseFloat(lon));
          }
        });
    }
  }, [locality, city]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e, setter) => {
    setter(e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden">
      <div className="w-[51.25rem] flex flex-col space-y-10 ml-14 mt-6">
        <div className="h-16 w-full">
          <LocationEnteringGroup
            labels={['Building/Society Name', 'Locality/Area']}
            required
            texts={['Enter Apartment Name', 'Eg: Sheetal Nagar']}
            values={[formData.building, formData.locality]}
            setters={[
              (value) => handleChange({ target: { name: 'building', value } }, setBuilding),
              (value) => handleChange({ target: { name: 'locality', value } }, setLocality),
            ]}
          />
        </div>
        <div className="h-16 w-full">
          <LocationEnteringGroup
            labels={['Landmark / Street Name', 'City']}
            texts={['Prominent Landmark', 'Eg: Mumbai, Maharashtra']}
            required
            values={[formData.landmark, formData.city]}
            setters={[
              (value) => handleChange({ target: { name: 'landmark', value } }, setLandmark),
              (value) => handleChange({ target: { name: 'city', value } }, setCity),
            ]}
          />
        </div>
        <div className="h-96 w-full">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>
                {formData.building}, {formData.locality}, {formData.landmark}, {formData.city}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

const Features = ({
  isPetsAllowed,
  setIsPetsAllowed,
  waterSupply,
  setWaterSupply,
  electricity,
  setElectricity,
  reservedParking,
  setReservedParking,
  cctv,
  setCctv,
}) => {
  return (
    <div className="flex flex-col w-[51.25rem] h-[70vh] mt-[2.25rem] ml-[4.875rem] space-y-[3.75rem]">
      <div className="flex flex-col space-y-[3.75rem]">
        <h1 className="font-Inter font-semibold text-[18px]">
          General Features
        </h1>
        <FormRadioGroup2
          label="Pets Allowed"
          value={isPetsAllowed}
          options={["Yes", "No"]}
          onChange={setIsPetsAllowed}
          required
        />
        <FormRadioGroup2
          label="Electricity"
          value={electricity}
          options={["Rare/No Powercut", "Frequent Powercut"]}
          onChange={setElectricity}
          required
        />
        <FormRadioGroup2
          label="Water Supply"
          value={waterSupply}
          options={["Municipal Corporation (BMC)", "Borewell", "Both"]}
          onChange={setWaterSupply}
          required
        />
      </div>
      <div className="flex flex-col space-y-[3.75rem]">
        <h1 className="font-Inter font-semibold text-[18px]">
          SOCIETY AMENITIES
        </h1>
        <div className="flex flex-row space-x-[5rem]">
          <div className="w-[8.438rem] h-[6rem] flex flex-col space-y-[1rem]">
            <div className="flex flex-col items-center justify-center">
              <img className="w-[35px] h-[34px]" src="cctv.png" alt="cctv" />
              <h1 className="font-Inter font-normal text-center text-[14px] text-[#7A7A7A]">
                CCTV Camera
              </h1>
            </div>
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                className="h-[26px] w-[26px]"
                checked={cctv === "Yes"}
                onChange={() => setCctv(cctv === "Yes" ? "No" : "Yes")}
              />
            </div>
          </div>
          <div className="w-[8.438rem] h-[6rem] flex flex-col space-y-[1rem]">
            <div className="flex flex-col items-center justify-center">
              <img className="w-[35px] h-[34px]" src="parking.png" alt="parking" />
              <h1 className="font-Inter font-normal text-center text-[14px] text-[#7A7A7A]">
                Reserved Parking
              </h1>
            </div>
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                className="h-[26px] w-[26px]"
                checked={reservedParking === "Yes"}
                onChange={() => setReservedParking(reservedParking === "Yes" ? "No" : "Yes")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PriceDetails = ({
  rent,
  setRent,
  maintenance,
  setMaintenance,
  maintenancePrice,
  setMaintenancePrice,
  maintenanceType,
  setMaintenanceType,
  security,
  setSecurity,
}) => {
  return (
    <div className="flex flex-col w-[51.25rem] h-[50vh] mt-[2.25rem] ml-[4.875rem] space-y-[3.75rem]">
      <div className="w-full flex flex-row justify-between text-black">
        <div className="flex h-[40px] flex-col justify-between">
          <label className="font-Inter font-medium mb-2 text-[16px]">
            Rent<span className="text-[#FF4D4F] ml-[2px]">*</span>
          </label>
          <div className="relative w-[23.75rem] h-[3.75rem]">
            <span className="absolute text-[#00000040] inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              ₹
            </span>
            <input
              type="text"
              placeholder=""
              required
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className="border border-[#D9D9D9] text-end px-2 py-1 text-black pl-6 pr-16 border-[2px] focus:outline-none w-full"
            />
            <span className="absolute text-[#00000040] inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              / month
            </span>
          </div>
        </div>
        <div className="flex h-[40px] flex-col justify-between">
          <label className="font-Inter font-medium mb-2 text-[16px]">
            Security<span className="text-[#FF4D4F] ml-[2px]">*</span>
          </label>
          <div className="relative w-[23.75rem] h-[3.75rem]">
            <span className="absolute text-[#00000040] inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              ₹
            </span>
            <input
              type="text"
              required
              placeholder=""
              value={security}
              onChange={(e) => setSecurity(e.target.value)}
              className="border border-[#D9D9D9] text-end px-2 py-1 text-black pl-6 pr-16 border-[2px] focus:outline-none w-full"
            />
            <span className="absolute text-[#00000040] inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              / month
            </span>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-row justify-between text-black">
        <div className="flex flex-col justify-between">
          <label className="font-Inter font-medium mb-2 text-[16px]">
            Maintenance<span className="text-[#FF4D4F] ml-[2px]">*</span>
          </label>
          <div className="w-[23.75rem] h-[36px]">
            <select
              value={maintenance}
              onChange={(e) => setMaintenance(e.target.value)}
              required
              className="border border-[#D9D9D9] h-[36px] text-end px-2 py-1 text-black pl-6 pr-16 border-[2px] focus:outline-none w-full"
            >
              <option
                value="Included in Rent"
                className="font-Inter font-normal text-[#122B49] text-[14px] border-[1px] border-[#7A7A7A] rounded-[2px]"
              >
                Included in Rent
              </option>
              <option
                value="Extra Maintenance"
                className="font-Inter font-normal text-[#122B49] text-[14px] border-[1px] border-[#7A7A7A] rounded-[2px]"
              >
                Extra Maintenance
              </option>
            </select>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <label className="font-Inter font-medium mb-2 text-[16px]">
            <span className="text-[#FF4D4F] ml-[2px]">*</span>
          </label>
          <div className="flex w-[23.75rem] justify-between h-[36px] flex-row">
            <div className="relative w-[11.35rem]">
              <span className="absolute text-[#00000040] inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                ₹
              </span>
              <input
                type="text"
                placeholder=""
                value={maintenancePrice}
                required
                onChange={(e) => setMaintenancePrice(e.target.value)}
                className="border border-[#D9D9D9] text-end px-2 py-1 text-black pl-6 pr-16 border-[2px] focus:outline-none w-full"
              />
              <span className="absolute text-[#00000040] inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                Maintenance
              </span>
            </div>
            <div className="w-[11.35rem]">
              <select
                value={maintenanceType}
                required
                onChange={(e) => setMaintenanceType(e.target.value)}
                className="border border-[#D9D9D9] h-[36px] text-end px-2 py-1 text-black pl-6 pr-16 border-[2px] focus:outline-none w-full"
              >
                <option
                  value="Monthly"
                  className="font-Inter font-normal text-[#122B49] text-[14px] border-[1px] border-[#7A7A7A] rounded-[2px]"
                >
                  Monthly
                </option>
                <option
                  value="Annually"
                  className="font-Inter font-normal text-[#122B49] text-[14px] border-[1px] border-[#7A7A7A] rounded-[2px]"
                >
                  Annually
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropImages = () => {
  return (
    <div className="flex flex-col w-[51.25rem] h-[50vh] mt-[2.25rem] ml-[4.875rem] space-y-[2.5rem]">
      <h1 className="font-Inter text-[18px] font-normal">
        Add Photos / videos to attract more tenants!
      </h1>
      <div className="w-full flex flex-col h-[28.563rem]">
        <h1 className="font-Inter text-[16px] font-medium">
          Add Photos of living room, bedroom, bathroom, floor, doors, kitchen,
          balcony, location map, neighborhood, etc
        </h1>
        <div className="flex items-center border-[1px] p-[10rem] border-[#D6D6D6] mt-4 justify-center h-[19.313rem]">
          <div className="w-[11rem] flex flex-col items-center h-[4.625rem]">
            <img src="camera.png" alt="camera" />
            <div className="flex w-[11rem] h-[2.5rem] items-center bg-[#122B46] text-white p-2 rounded-md">
              <div className="flex-shrink-0 w-6 h-4 text-[26px] text-white flex items-center justify-center mr-2">
                +
              </div>
              <h1 className="font-Inter text-[16px] font-medium">
                Add Photos Now
              </h1>
            </div>
          </div>
        </div>
        <h1 className="font-Inter text-[16px] mt-4 font-medium">OR</h1>
        <h1 className="font-Inter text-[16px] mt-7 font-medium">
          Add Photos of living room, bedroom, bathroom, floor, doors, kitchen,
          balcony, location map, neighborhood, etc
        </h1>
        <h1 className="font-Inter text-[12px] mt-7 font-medium">
          Accepted formats are .jpg, .gif, .bmp & .png.
          <br /> Maximum size allowed is 20 MB. Minimum dimension allowed
          600*400 Pixel
        </h1>
      </div>
    </div>
  );
};

const About = () => {
  const [propertyFor, setPropertyFor] = useState("Rent");
  const [propertyType, setPropertyType] = useState("Residential");
  const [propertySubType, setPropertySubType] = useState("");
  const [propertyAge, setPropertyAge] = useState("");
  const [bhkType, setBhkType] = useState("");
  const [building, setBuilding] = useState("");
  const [locality, setLocality] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [isPetsAllowed, setIsPetsAllowed] = useState("");
  const [waterSupply, setWaterSupply] = useState("");
  const [electricity, setElectricity] = useState("");
  const [reservedParking, setReservedParking] = useState("No");
  const [cctv, setCctv] = useState("No");
  const [rent, setRent] = useState("");
  const [security, setSecurity] = useState("");
  const [maintenance, setMaintenance] = useState("");
  const [maintenancePrice, setMaintenancePrice] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("Monthly");
  const [isActive, setIsActive] = useState(TABS[0].id);

  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);

  // V2 auth + submission state
  const [propertyId, setPropertyId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [mapLat, setMapLat] = useState(null);
  const [mapLng, setMapLng] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const getToken = () => localStorage.getItem('pd_token');
  const setToken = (t) => localStorage.setItem('pd_token', t);
  const clearToken = () => localStorage.removeItem('pd_token');

  const handleAuthSubmit = async (onSuccess) => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const url = authMode === 'register'
        ? `${API_BASE}/auth/register`
        : `${API_BASE}/auth/login`;
      const body = authMode === 'register'
        ? { name: authName, email: authEmail, password: authPassword }
        : { email: authEmail, password: authPassword };
      const res = await axios.post(url, body);
      setToken(res.data.access_token);
      setShowAuth(false);
      onSuccess(res.data.access_token);
    } catch (err) {
      setAuthError(err.response?.data?.error || err.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (isActive === "prop-images") {
      setShowOverlay(true);
      return;
    }

    const token = getToken();
    if (!token) {
      setShowAuth(true);
      return;
    }

    const authHeader = { Authorization: `Bearer ${token}` };

    const handleApiError = (err) => {
      if (err.response?.status === 401) {
        clearToken();
        setShowAuth(true);
      } else {
        setSubmitError(err.response?.data?.error || err.message || 'Something went wrong.');
      }
    };

    setSubmitting(true);
    try {
      if (isActive === "prop-details") {
        let pid = propertyId;
        if (!pid) {
          const createRes = await axios.post(
            `${API_BASE}/properties`,
            {},
            { headers: authHeader }
          );
          pid = createRes.data.property_id;
          setPropertyId(pid);
        }
        await axios.patch(
          `${API_BASE}/properties/${pid}/details`,
          {
            property_for: propertyFor,
            property_type: propertyType,
            property_subtype: propertySubType,
            property_age: propertyAge,
            bhk_type: bhkType,
          },
          { headers: authHeader }
        );
        setIsActive("location-details");

      } else if (isActive === "location-details") {
        if (!propertyId) {
          setSubmitError('Please complete property details first.');
          setIsActive('prop-details');
          return;
        }
        await axios.patch(
          `${API_BASE}/properties/${propertyId}/location`,
          { building, locality, landmark, city, lat: mapLat, lng: mapLng },
          { headers: authHeader }
        );
        setIsActive("features");

      } else if (isActive === "features") {
        if (!propertyId) {
          setSubmitError('Please complete property details first.');
          setIsActive('prop-details');
          return;
        }
        await axios.patch(
          `${API_BASE}/properties/${propertyId}/features`,
          {
            is_pets_allowed: isPetsAllowed === 'Yes',
            reserved_parking: reservedParking === 'Yes',
            cctv: cctv === 'Yes',
            water_supply: waterSupply,
            electricity: electricity,
          },
          { headers: authHeader }
        );
        setIsActive("price-details");

      } else if (isActive === "price-details") {
        if (!propertyId) {
          setSubmitError('Please complete property details first.');
          setIsActive('prop-details');
          return;
        }
        await axios.patch(
          `${API_BASE}/properties/${propertyId}/pricing`,
          {
            rent,
            security_deposit: security,
            maintenance,
            maintenance_price: maintenancePrice,
            maintenance_type: maintenanceType,
          },
          { headers: authHeader }
        );
        setIsActive("prop-images");
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = async () => {
    const token = getToken();
    if (!propertyId || !token) {
      setSubmitError('Session expired. Please log in again.');
      setShowOverlay(false);
      setShowAuth(true);
      return;
    }
    try {
      await axios.patch(
        `${API_BASE}/properties/${propertyId}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/thanks");
    } catch (err) {
      setSubmitError(err.response?.data?.error || err.message || "Failed to publish. Please try again.");
      setShowOverlay(false);
    }
  };

  const handleCancel = () => {
    setShowOverlay(false);
  };

  const getTabClassName = (index) =>
    index >= TABS.findIndex((tab) => tab.id === isActive)
      ? "bg-[#D6D6D6]"
      : "bg-[#122B46]";

  const renderActiveTabContent = () => {
    switch (isActive) {
      case "location-details":
        return (
          <LocationDetails
            building={building}
            setBuilding={setBuilding}
            locality={locality}
            setLocality={setLocality}
            landmark={landmark}
            setLandmark={setLandmark}
            city={city}
            setCity={setCity}
            onLatChange={setMapLat}
            onLngChange={setMapLng}
          />
        );
      case "features":
        return (
          <Features
            isPetsAllowed={isPetsAllowed}
            setIsPetsAllowed={setIsPetsAllowed}
            waterSupply={waterSupply}
            setWaterSupply={setWaterSupply}
            electricity={electricity}
            setElectricity={setElectricity}
            reservedParking={reservedParking}
            setReservedParking={setReservedParking}
            cctv={cctv}
            setCctv={setCctv}
          />
        );
      case "price-details":
        return (
          <PriceDetails
            rent={rent}
            setRent={setRent}
            security={security}
            setSecurity={setSecurity}
            maintenance={maintenance}
            setMaintenance={setMaintenance}
            maintenanceType={maintenanceType}
            setMaintenanceType={setMaintenanceType}
            maintenancePrice={maintenancePrice}
            setMaintenancePrice={setMaintenancePrice}
          />
        );
      case "prop-images":
        return <PropImages />;
      default:
      case "prop-details":
        return (
          <PropertyForm
            propertyFor={propertyFor}
            setPropertyFor={setPropertyFor}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            propertySubType={propertySubType}
            setPropertySubType={setPropertySubType}
            propertyAge={propertyAge}
            setPropertyAge={setPropertyAge}
            bhkType={bhkType}
            setBhkType={setBhkType}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#ffffff] py-6 overflow-x-hidden">
      <div className="flex flex-col w-full max-w-[61rem] h-[38rem] rounded-[1rem] shadow-md shadow-[#122B492E] mx-auto bg-[#FFFFFF]">
        <div className="w-full h-[5.5rem] flex flex-col">
          <div className="h-[5rem] flex flex-row w-full bg-[#FCF8F4]">
            {TABS.map((tab) => (
              <div
                key={tab.id}
                className={`${
                  isActive === tab.id
                    ? "bg-[#EDF2F8] text-[#122B49] shadow-sm shadow-[#00000040]"
                    : "text-[#7A7A7A]"
                } w-1/5 h-full flex items-center justify-center font-MerriweatherSans font-normal text-[14px]`}
              >
                <span className="w-[7.625rem] text-center">
                  <h1>{tab.label}</h1>
                </span>
              </div>
            ))}
          </div>
          <div className="h-[.5rem] w-full flex">
            {TABS.map((tab, index) => (
              <div
                key={tab.id}
                className={`${getTabClassName(index)} w-4/5 h-full`}
              ></div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="w-full flex rounded-b-[1rem] flex-col justify-between h-[32.5rem]">
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              {renderActiveTabContent()}
            </div>
            <div className="h-[3.75rem] px-7 flex flex-row text-[#FFFFFF] items-center justify-between rounded-b-[1rem] bg-[#122B49]">
              <div className="flex flex-col ml-[1.25rem]">
                <h1 className="font-Inter font-normal text-[12px]">
                  Need Help? Call{" "}
                  <span className="font-Inter font-medium text-[12px]">
                    9999999999
                  </span>
                </h1>
                {submitError && (
                  <p className="font-Inter text-[11px] text-red-300 mt-0.5">{submitError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className={`bg-[#091524] font-inter font-normal rounded-[8px] mr-[1.5rem] text-[#FFFFFF] w-[6.875rem] h-[2rem] transition-opacity ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {submitting ? '...' : 'NEXT'}
              </button>
              {showOverlay && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleCancel}>
                  <div className="flex items-center justify-center w-[29.313rem] bg-[#ffffff] p-8 rounded-lg" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col justify-center w-[24.313rem]">
                      <h1 className="text-[#122B46] font-Inter text-center font-medium text-[16px]">
                        POST PROPERTY ON PROPERTYDEAL?
                      </h1>
                      <div className="flex flex-col mt-5 w-full space-y-[10px]">
                        <button
                          type="button"
                          onClick={handleContinue}
                          className="w-full bg-[#122B46] h-[2.55rem] text-center font-MerriweatherSans font-bold text-[16px] rounded-[4px]"
                        >
                          Continue
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="w-full h-[2.55rem] text-center font-MerriweatherSans font-normal text-[14px] text-[#7A7A7A] hover:text-[#122B49] transition-colors"
                        >
                          Cancel
                        </button>
                        <p className="text-[#122B49] font-MerriweatherSans text-center font-light text-[12px]">
                          By continuing you agree to our{" "}
                          <span className="underline font-normal">
                            Terms and Conditions & Privacy Policy
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Auth overlay — shown when no token is present */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-[14px] shadow-xl w-full max-w-sm p-8">
            <h2 className="font-MerriweatherSans text-[20px] text-[#122B49] mb-1">
              {authMode === 'login' ? 'Log in to continue' : 'Create an account'}
            </h2>
            <p className="font-Inter text-[13px] text-[#7A7A7A] mb-5">
              {authMode === 'login'
                ? 'Sign in to save and post your listing.'
                : 'Create a free account to post your property.'}
            </p>
            {authMode === 'register' && (
              <input
                className="w-full border border-[#E5E7EB] rounded-[8px] px-4 py-2.5 font-Inter text-[14px] mb-3 outline-none focus:border-[#122B49]"
                placeholder="Full name"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
              />
            )}
            <input
              className="w-full border border-[#E5E7EB] rounded-[8px] px-4 py-2.5 font-Inter text-[14px] mb-3 outline-none focus:border-[#122B49]"
              placeholder="Email address"
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />
            <input
              className="w-full border border-[#E5E7EB] rounded-[8px] px-4 py-2.5 font-Inter text-[14px] mb-4 outline-none focus:border-[#122B49]"
              placeholder="Password"
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
            />
            {authError && (
              <p className="font-Inter text-[12px] text-red-500 mb-3">{authError}</p>
            )}
            <button
              onClick={() => handleAuthSubmit(() => {
                if (!propertyId) setIsActive('prop-details');
                handleSubmit({ preventDefault: () => {} });
              })}
              disabled={authLoading}
              className="w-full bg-[#122B49] text-white font-Inter font-medium text-[14px] py-3 rounded-[8px] hover:bg-[#0a1e34] transition-colors disabled:opacity-60"
            >
              {authLoading ? 'Please wait…' : authMode === 'login' ? 'Log in' : 'Create account'}
            </button>
            <p className="font-Inter text-[12px] text-[#7A7A7A] mt-4 text-center">
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                className="text-[#122B49] underline"
                onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(null); }}
              >
                {authMode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
