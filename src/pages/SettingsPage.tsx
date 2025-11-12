import DataContainer from "@/features/settings/components/DataContainer";
import InputDataField from "@/features/settings/components/InputDataField";
import StatusField from "@/features/settings/components/StatusField";
import Header from "@/shared/components/Header";
import { FaLink } from "react-icons/fa6";
import { FaServer } from "react-icons/fa6";
import { FaLock } from "react-icons/fa6";
import { FaKey } from "react-icons/fa6";
import { FaBell } from "react-icons/fa6";

const MAX = 2000;
const MIDDLE = 1000;
const MIN = 100;

const marks = [
  {
    value: MIN,
    label: `${MIN}m`,
  },
  {
    value: MIDDLE,
    label: `${MIDDLE}m`,
  },
  {
    value: MAX,
    label: `${MAX}m`,
  },
];

const SettingsPage = () => {
  return (
    <div className="w-full h-screen bg-icy-mint ">
      <Header title="Asetukset" backButton />

      {/* Scrollable view for settings */}
      <div className="overflow-y-auto h-[calc(100vh-64px)] pb-10">
        {/* API Configuration Form */}
        <form autoComplete="off">
          <DataContainer
            ContainerHeader="API Konfiguraatio"
            ContainerDescription="Traccar palvelimen yhteysasetukset"
            HeaderIcon={
              <div className="text-3xl bg-icy-blue/30 p-4 rounded-xl">
                <FaServer className="text-icy-blue text-2xl" />
              </div>
            }
          >
            <InputDataField
              Header="API URL"
              valueKey="apiUrl"
              Description="Anna koko URL osoite Traccar-API-palvelimelle"
              Icon={<FaLink className="text-dark-navy-purple w-6" />}
            />
            <StatusField ButtonText="Testaa Yhteys">
              {/* Change this to use some kind of functionality */}
              <div>Yhdistetty</div>
            </StatusField>
          </DataContainer>
        </form>

        {/* Token Management Form */}
        <form autoComplete="off">
          <DataContainer
            ContainerHeader="Avain Hallinta"
            ContainerDescription="Muokkaa Traccar API tokenia"
            HeaderIcon={
              <div className="text-3xl bg-warning-bg p-4 rounded-xl">
                <FaKey className="text-warning-badge text-2xl" />
              </div>
            }
          >
            <InputDataField
              Header="API Avain"
              valueKey="apiKey"
              Description="Syötä Traccar-API-token"
              Icon={<FaLock className="text-dark-navy-purple w-6" />}
              sensitive
            />
            <StatusField
              ButtonText="Päivitä Token"
              ButtonColor="bg-dark-navy-purple"
            >
              {/* Change this to use some kind of functionality */}
              <div>Token on voimassa</div>
            </StatusField>
          </DataContainer>
        </form>

        {/* Notification Range Form */}
        <form autoComplete="off">
          <DataContainer
            ContainerHeader="Hälytyksen ilmoitusetäisyys"
            ContainerDescription="Aseta etäisyys, jolla hälytykset laukaistaan"
            HeaderIcon={
              <div className="text-3xl bg-danger-bg p-4 rounded-xl">
                <FaBell className="text-danger-badge text-2xl" />
              </div>
            }
          >
            <InputDataField
              Header="Ilmoitusetäisyys"
              valueKey="alertRange"
              Description="Aseta hälytyksen ilmoitusetäisyys metreinä"
              slider
              sliderMarks={marks}
              defaultValue={500}
              sliderMin={MIN}
              sliderMax={MAX}
              sliderStep={100}
            />
          </DataContainer>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
