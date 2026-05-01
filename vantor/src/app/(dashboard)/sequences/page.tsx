import { SEQUENCE_TEMPLATES } from "@/server/services/sequences";
import { SequencesClient } from "./sequences-client";

export default function SequencesPage() {
  return <SequencesClient templates={SEQUENCE_TEMPLATES} />;
}
