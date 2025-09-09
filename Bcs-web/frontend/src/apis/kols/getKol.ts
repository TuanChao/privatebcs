import { HomeKOLs } from "../../components/pages/Home/Home.type";
import { endpoint } from "../../const/endpoint";
import httpRequest from "../../utilities/services/httpRequest";

export function getAllKols() {
  return httpRequest.get<HomeKOLs[]>(endpoint.kol);
}
