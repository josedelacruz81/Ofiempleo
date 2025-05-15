"use client";
import { SkillLabel } from "@/components/cards/SkillLabel";
import { useToast } from "@/components/shadCn/useToast";
import { supabase } from "@/lib/supabase";
import { payTypes, Skills } from "@/types";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiEdit3 } from "react-icons/fi";

export const EditProfileModal = ({
  professionId,
  postId,
  defaultData,
}: {
  postId: string;
  professionId: number | string;
  defaultData: {
    description: string;
    hourly: number;
    typeWork?: string;
    skills: string[];
  };
}) => {
  const [skills, setSkills] = useState<Skills[]>([]);
  const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();
  const [value, setValue] = useState(new Set([]));
  const { toast } = useToast();
  const [postData, setPostData] = useState({
    description: "",
    hourly: "",
    typeWork: "",
    skills: new Set([]),
  });
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleSkillsChange = (e: any) => {
    setPostData({
      ...postData,
      skills: new Set(e.target.value.split(",")),
    });
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };

  const getSkills = async () => {
    const { data, error } = await supabase
      .from("skills")
      .select()
      .eq("jobId", professionId);
    if (error) {
      console.log(error);
      return
    }
    setSkills(data);
  };

  useEffect(() => {
    getSkills();

  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const skillsArray = Array.from(postData.skills);
    const res = await fetch(`/api/posts/${postId}`, {
      method: "PUT",
      body: JSON.stringify({
        ...postData,
        typeWork: value.has("job" as never) ? "job" : "hourly",
        skills: skillsArray,
        hourly: value.has("job" as never) ? 0 : postData.hourly,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErrors(data);
      return;
    }
    setPostData({
      description: "",
      hourly: "",
      typeWork: "",
      skills: new Set([]),
    });
    toast({
      description: data.message,

      variant: "destructive",
      className: "bg-green-500 text-white",
    });
    handleClose();
    router.refresh();
  };

  const handleClose = () => {
    setPostData({
      description: "",
      hourly: "",
      typeWork: "",
      skills: new Set([]),
    });
    onClose();
  }


  return (
    <>
      <Button onPressEnd={onOpen} variant="flat" color="warning" isIconOnly>
        <FiEdit3 />
      </Button>
      <Modal
        size="lg"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                <h3>Editar perfil publicado</h3>
              </ModalHeader>
              <ModalBody>
                <fieldset>
                  <Textarea
                    placeholder={defaultData.description}
                    value={postData.description}
                    name="description"
                    onChange={handleChange}
                    label="Descripción"
                    variant="faded"
                  />
                  {errors.description && (
                    <p className="text-danger text-xs">{errors.description}</p>
                  )}
                </fieldset>
                <fieldset>
                  <Select
                    selectionMode="multiple"
                    radius="lg"
                    variant="faded"
                    label="habilidades"
                    isMultiline
                    onChange={handleSkillsChange}
                    renderValue={(items) => {
                      return (
                        <div className="flex flex-wrap gap-2">
                          {items.map((item) => (
                            <SkillLabel key={item.key}>
                              {item.textValue}
                            </SkillLabel>
                          ))}
                        </div>
                      );
                    }}
                  >
                    {skills.map((skill, index) => (
                      <SelectItem key={skill.name} textValue={skill.name}>
                        {skill.name}
                      </SelectItem>
                    ))}
                  </Select>
                  {errors.skills && (
                    <p className="text-danger text-xs">{errors.skills}</p>
                  )}
                </fieldset>
                <fieldset className="col-span-2 grid md:grid-cols-2 gap-4">
                  <div
                    className={` transition-all ${
                      value.has("job" as never) ? "md:col-span-2" : ""
                    }`}
                  >
                    <Select
                      //@ts-ignore
                      onSelectionChange={setValue}
                      selectedKeys={value}
                      radius="lg"
                      variant="faded"
                      label="Modo de trabajo"
                    >
                      {payTypes.map(({ label, value }) => (
                        <SelectItem key={value} value="USD">
                          {label}
                        </SelectItem>
                      ))}
                    </Select>
                    {errors.hourly && (
                      <p className="text-red-500 text-xs">{errors.typeWork}</p>
                    )}
                  </div>
                  {!value.has("job" as never) && (
                    <div className="flex flex-col">
                      <Input
                        variant="faded"
                        name="hourly"
                        value={postData.hourly}
                        placeholder={defaultData.hourly.toString()}
                        onChange={handleChange}
                        type="number"
                        label="Cantidad"
                        endContent={<p className="text-gray-500">$</p>}
                      />
                      {errors.hourly && (
                        <p className="text-red-500 text-xs">{errors.hourly}</p>
                      )}
                    </div>
                  )}
                  {errors.typeWork && (
                    <p className="text-red-500 text-xs">{errors.typeWork}</p>
                  )}
                </fieldset>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={()=>{
                  setPostData({
                    description: "",
                    hourly: "",
                    typeWork: "",
                    skills: new Set([]),
                  });
                  onClose()

                }}>
                  Cerrar
                </Button>
                <Button type="submit" color="primary">
                  Guardar
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
