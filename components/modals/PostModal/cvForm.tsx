"use client";
import { InputFile } from "@/components/littleComponents/InputFile";
import { useEffect, useState } from "react";
import {
  Image as NextImage,
  CardBody,
  CardFooter,
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
  ScrollShadow,
  CardHeader,
  Select,
  SelectItem,
  Chip,
  Tooltip,
  Divider,
} from "@nextui-org/react";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { z } from "zod";
import { jobInterface, payTypes, skillInterface, userInterface } from "@/types";
import { useToast } from "@/components/shadCn/useToast";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { SkillLabel } from "@/components/cards/SkillLabel";
import { useRouter } from "next/navigation";
import { ProfileImage } from "@/app/employee/components/profile";
import { HiOutlineTrash } from "react-icons/hi";
import { jobRequestSchema, processZodError } from "@/lib/zodValidations";

const schema = z.object({
  profession: z
    .string({
      required_error: "La profesión es obligatoria",
      invalid_type_error: "La profesión es obligatoria",
    })
    .min(1, "La profesión es obligatoria"),
  hourly: z.number().positive("Tienes que ingresar un valor").optional(),
  description: z
    .string()
    .min(18, "La descripción debe tener al menos 18 caracteres"),
  skills: z.string().array().nonempty({
    message: "Debes seleccionar al menos una habilidad",
  }),
  selectedImages: z.string().array().nonempty({
    message: "Debes seleccionar al menos una imagen",
  }),
  typeWork: z.string({
    message: "Debes seleccionar un modo de trabajo",
  }),
});
const jobSchema = z.object({
  profession: z
    .string({
      required_error: "La profesión es obligatoria",
      invalid_type_error: "La profesión es obligatoria",
    })
    .min(1, "La profesión es obligatoria"),
  description: z
    .string()
    .min(18, "La descripción debe tener al menos 18 caracteres"),
  skills: z.string().array().nonempty({
    message: "Debes seleccionar al menos una habilidad",
  }),
  selectedImages: z.string().array().nonempty({
    message: "Debes seleccionar al menos una imagen",
  }),
  typeWork: z.string({
    message: "Debes seleccionar un modo de trabajo",
  }),
});

export const CvForm = ({
  user,
  requested,
}: {
  user: userInterface;
  requested: boolean;
}) => {
  const [profileImage, setProfileImage] = useState(user.profileImage);

  const [skills, setSkills] = useState<skillInterface[]>([]);
  const [jobs, setJobs] = useState<jobInterface[]>([]);
  const [postData, setPostData] = useState({
    profession: "",
    hourly: 0,
    description: "",
    skills: new Set([]),
  });
  const [requestStatus, setRequestStatus] = useState(requested);
  const [value, setValue] = useState(new Set([]));
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { refresh } = useRouter();
  const [jobRequest, setJobRequest] = useState("");
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const imagesData = files.map((file: File) => {
      return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagesData)
      .then((imagesDataURL) => {
        const validImages = imagesDataURL.filter(
          (url): url is string => typeof url === "string"
        );
        setSelectedImages((prevImages) => [...prevImages, ...validImages]);
      })
      .catch((error) => {
        console.error("Error al cargar las imágenes:", error);
      });
  };

  const validateForm = () => {
    try {
      const skillsArray = Array.from(postData.skills);
      schema.parse({
        ...postData,
        hourly: Number(postData.hourly),
        skills: skillsArray,
        selectedImages,
        typeWork: value.has("job" as never)
          ? "job"
          : value.has("hourly" as never)
          ? "hourly"
          : value.has("daily" as never)
          ? "daily"
          : null,
      });
      if (skillsArray.length === 0 || Array.from(postData.skills)[0] === "") {
        setErrors({
          ...errors,
          skills: "Debes seleccionar al menos una habilidad",
        });
        return false;
      }
      setErrors({}); // Limpiar los errores si la validación es exitosa
      return true;
    } catch (error: any) {
      const formattedErrors: { [key: string]: string } = {};
      error.issues.forEach((issue: any) => {
        formattedErrors[issue.path[0]] = issue.message;
      });

      setErrors(formattedErrors);
      return false;
    }
  };

  const validateFormJob = () => {
    try {
      const skillsArray = Array.from(postData.skills);
      jobSchema.parse({
        ...postData,
        skills: skillsArray,
        selectedImages,
        typeWork: value.has("job" as never)
          ? "job"
          : value.has("hourly" as never)
          ? "hourly"
          : value.has("daily" as never)
          ? "daily"
          : null,
      });
      if (skillsArray.length === 0 || Array.from(postData.skills)[0] === "") {
        setErrors({
          ...errors,
          skills: "Debes seleccionar al menos una habilidad",
        });
        return false;
      }
      setErrors({}); // Limpiar los errores si la validación es exitosa
      return true;
    } catch (error: any) {
      const formattedErrors: { [key: string]: string } = {};
      error.issues.forEach((issue: any) => {
        formattedErrors[issue.path[0]] = issue.message;
      });

      setErrors(formattedErrors);
      return false;
    }
  };

  const popImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const skillsArray = Array.from(postData.skills);

    setErrors({});

    if (value.has("job" as never)) {
      if (!validateFormJob()) {
        return;
      }
    } else {
      if (!validateForm()) {
        return;
      }
    }
    if (!profileImage || profileImage === "") {
      toast({
        title: "Error",
        description: "Debes subir una foto de perfil",
        variant: "destructive",
        className: "text-red-500 bg-red-100",
      });
      return;
    }
    if (selectedImages.length === 0) {
      setErrors({ selectedImages: "Debes seleccionar al menos una imagen" });
      return;
    }
    if (selectedImages.length > 5) {
      setErrors({ selectedImages: "No puedes seleccionar más de 5 imágenes" });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      const typeWork = value.has("job" as never)
        ? "job"
        : value.has("hourly" as never)
        ? "hourly"
        : value.has("daily" as never)
        ? "daily"
        : "";

      formData.append("profession", postData.profession);
      !value.has("job" as never) &&
        formData.append("hourly", postData.hourly.toString());
      formData.append("description", postData.description);
      formData.append("skills", JSON.stringify(skillsArray));
      formData.append("typeWork", typeWork);
      selectedImages.forEach((imageData, index) => {
        formData.append(`image${index + 1}`, imageData);
      });

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",

          description: data.message,
          variant: "destructive",
          className: "text-red-500 bg-red-100",
        });

        throw new Error("Error al crear el post");
      }
      toast({
        title: "Post creado",
        variant: "destructive",
        className: "text-green-500 bg-green-100",
        description: "Tu post ha sido creado exitosamente",
      });
      refresh();
    } catch (error) {
      console.error("Error al crear el post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSkillsChange = (e: any) => {
    setPostData({
      ...postData,
      skills: new Set(e.target.value.split(",")),
    });
  };
  const getSkills = async (skillid: number | string) => {
    const { data, error } = await supabase
      .from("skills")
      .select()
      .eq("jobId", skillid);
    if (error) {
      console.error(error);
      return;
    }
    setSkills(data);
  };
  const getJobs = async () => {
    const { data, error } = await supabase.from("jobs").select("*");
    if (error) {
      console.log(error);
      return;
    }

    setJobs(data);
  };

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    getSkills(postData.profession);
  }, [postData.profession]);

  const handleJobRequest = async () => {
    try {
      jobRequestSchema.parse({ jobName: jobRequest });
      const { error } = await supabase.from("jobRequests").insert({
        jobName: jobRequest,
        userId: user.id,
      });
      if (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Error al solicitar el empleo",
          variant: "destructive",
          className: "text-red-500 bg-red-100",
        });
        return;
      }
      setRequestStatus(true);
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud ha sido enviada exitosamente",
        variant: "destructive",
        className: "text-green-500 bg-green-100",
      });
    } catch (error) {
      const { jobName } = processZodError(error);
      toast({
        title: "Error",
        description: jobName,
        variant: "destructive",
        className: "text-red-500 bg-red-100",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader className="flex flex-col items-start gap-3">
        <h2 className="text-xl font-semibold">Registra tu perfil</h2>
        <ProfileImage
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          user={user}
        />
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col gap-4">
        <h4 className="my-1">Sube imagenes de trabajos previos o de referencia</h4>
        <div>
          <ScrollShadow
            size={10}
            hideScrollBar
            className="flex gap-2 flex-wrap"
          >
            {selectedImages.map((imageData, index) => (
              <button
                key={index}
                className="relative flex items-center justify-center"
                onClick={() => popImage(index)}
              >
                <NextImage
                  as={Image}
                  src={imageData}
                  alt={`Imagen ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-32 h-32 object-cover rounded-xl"
                />
                <HiOutlineTrash
                  className=" text-danger absolute top-1/2 z-10"
                  size={20}
                />
              </button>
            ))}
            {selectedImages.length < 5 && (
              <InputFile className="col-span-1" onChange={handleImageChange}>
                <div className="flex items-center justify-center border-21 hover:border-[#a1a1aa] border-[#e4e4e7] transition-colors rounded-xl flex-col text-gray-600 gap-2 h-32 border-separate border-2 w-full">
                  <MdOutlineAddPhotoAlternate size={25} />
                  <p className="text-sm">Añadir imagen</p>
                </div>
              </InputFile>
            )}
          </ScrollShadow>
          {errors.selectedImages && (
            <p className="text-red-500 text-xs">{errors.selectedImages}</p>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <fieldset className="col-span-2">
            <Autocomplete
              fullWidth
              className="md:col-span-2"
              variant="faded"
              selectedKey={postData.profession}
              onSelectionChange={(value: any) =>
                setPostData({ ...postData, profession: value })
              }
              defaultItems={jobs}
              label="Seleccione el oficio en el que se especializa"
            >
              {(job) => (
                <AutocompleteItem key={job.id} textValue={job.name}>
                  {job.name}
                </AutocompleteItem>
              )}
            </Autocomplete>

            {errors.profession && (
              <p className="text-red-500 text-xs">{errors.profession}</p>
            )}
          </fieldset>
          {postData.profession === "17" && (
            <>
              <fieldset>
                <Input
                  onChange={(e) => setJobRequest(e.target.value)}
                  variant="faded"
                  value={
                    requestStatus ? "Ya has solicitado un oficio" : jobRequest
                  }
                  label="Empleo a solicitar"
                  placeholder="Escribe el empleo que quieres que se añada"
                />
              </fieldset>
              <Tooltip
                content={
                  <div className="w-56">
                    <p className="text-wrap">
                      Si no encuentras el empleo que buscas, puedes solicitarlo
                    </p>
                  </div>
                }
              >
                <Button
                  onPress={handleJobRequest}
                  variant="bordered"
                  color="warning"
                  className="h-full"
                  isDisabled={requestStatus}
                >
                  Solicitar
                </Button>
              </Tooltip>
            </>
          )}
          <fieldset className="col-span-2">
            <Select
              selectionMode="multiple"
              radius="lg"
              variant="faded"
              label="Habilidades"
              isMultiline
              onChange={handleSkillsChange}
              renderValue={(items) => {
                return (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <SkillLabel key={item.key}>{item.textValue}</SkillLabel>
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
              <p className="text-red-500 text-xs">{errors.skills}</p>
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
                  placeholder="10.00"
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
          </fieldset>
        </div>

        <div>
          <Input
            variant="faded"
            name="description"
            onChange={handleChange}
            label="Describa el trabajo que realiza"
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description}</p>
          )}
        </div>
        {/* <div>
            <SkillsForm setSkills={setSkills} skills={skills} />
            {errors.skills && (
              <p className="text-red-500 text-xs">{errors.skills}</p>
            )}
          </div> */}
      </CardBody>

      <CardFooter className="flex flex-col">
        <Button
          className="w-full"
          isLoading={loading}
          type="submit"
          color="primary"
        >
          Enviar
        </Button>
      </CardFooter>
    </form>
  );
};
