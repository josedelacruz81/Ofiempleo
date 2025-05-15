import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

import { HiOutlinePlus } from "react-icons/hi";
import { useState } from "react";
import { SkillLabel } from "@/components/cards/SkillLabel";

export const SkillsForm = ({
  skills,
  setSkills,
}: {
  skills: string[];
  setSkills: (skills: string[]) => void;
}) => {
  const [skill, setSkill] = useState("");

  const addSkill = () => {
    if (!skill) return;
    setSkills([...skills, skill]);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="grid grid-cols-12 gap-4">
        <Input
          variant="faded"
          onChange={(e) => setSkill(e.target.value)}
          value={skill}
          className="col-span-10"
          label="Habilidades"
        />
        <Button
          onPress={() => {
            addSkill();
            setSkill("");
          }}
          variant="light"
          isIconOnly
          
          color="primary"
          className="col-span-2 w-full h-full"
        >
          <HiOutlinePlus size={30} />
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap overflow-auto max-h-20">
        {skills.map((skill, index) => (
          <SkillLabel
            onClose={() => setSkills(skills.filter((s) => s !== skill))}
            key={index}
          >
            {skill}
          </SkillLabel>
        ))}
      </div>
    </div>
  );
};
