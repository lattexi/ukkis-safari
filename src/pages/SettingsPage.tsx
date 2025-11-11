import DataContainer from "@/features/settings/components/DataContainer";
import InputDataField from "@/features/settings/components/InputDataField";
import StatusField from "@/features/settings/components/StatusField";
import Header from "@/shared/components/Header";
import { FaLink } from "react-icons/fa6";
import { FaServer } from "react-icons/fa6";

const SettingsPage = () => {
  return (
    <div className="w-full h-screen bg-icy-mint">
      <Header title="Asetukset" backButton />
      {/* API Configuration */}
      <DataContainer
        ContainerHeader="API Configuration"
        ContainerDescription="Traccar server connection settings"
        HeaderIcon={
          <div className="text-3xl bg-icy-blue/30 p-3 rounded-xl">
            <FaServer className="text-icy-blue" />
          </div>
        }
      >
        <InputDataField
          Header="API URL"
          Description="Anna koko URL osoite Traccar-API-palvelimelle"
          Icon={<FaLink className="text-dark-navy-purple w-6" />}
        />
        <StatusField ButtonText="Testaa Yhteys">
          {/* Change this to use some kind of functionality */}
          <div>Yhdistetty</div>
        </StatusField>
      </DataContainer>

      {/* Token Management */}
    </div>
  );
};
export default SettingsPage;
