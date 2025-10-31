"use client";

import { useState, useTransition } from "react";
import {
  JournalEntryType,
  JournalEntryGiNoGi,
  JournalEntryArea,
  JournalEntryFeeling,
} from "@/lib/models/JournalEntry";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { JournalEntryValidation, JournalEntryUpdateValidation } from "@/lib/validations/journalEntryValidation";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldSet,
  FieldTitle,
  FieldError,
  } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { SerializedJournalEntry } from "@/types/journalEntries";
import { zodResolver } from "@hookform/resolvers/zod";
import { journalEntryValidation } from "@/lib/validations/journalEntryValidation";
import { z } from "zod";

interface JournalFormCreateProps {
  serverAction: (data: JournalEntryValidation) => Promise<void>;
  journalEntry?: never;
}

interface JournalFormEditProps {
  serverAction: (data: JournalEntryUpdateValidation) => Promise<void>;
  journalEntry: SerializedJournalEntry;
}

type JournalFormProps = JournalFormCreateProps | JournalFormEditProps;

type JournalFormData = Omit<JournalEntryValidation, "partners"> & {
  partners: { name: string }[];
};

const journalEntryFormValidation = journalEntryValidation.extend({
  partners: z.array(z.object({ name: z.string().min(1) })),
});

export function JournalForm({ serverAction, journalEntry }: JournalFormProps) {
  const [isPending, startTransition] = useTransition();
  const [openDatePicker, setOpenDatePicker] = useState(false);
  
  // Transform journal entry data for form population
  const getDefaultValues = (): JournalFormData => {
    if (journalEntry) {
      return {
        date: new Date(journalEntry.date),
        duration: journalEntry.duration,
        type: journalEntry.type as JournalEntryType,
        giNoGi: journalEntry.giNoGi as JournalEntryGiNoGi,
        area: journalEntry.area as JournalEntryArea,
        feeling: journalEntry.feeling as JournalEntryFeeling,
        questions: journalEntry.questions || "",
        location: journalEntry.location,
        professor: journalEntry.professor || "",
        depthNotes: journalEntry.depthNotes,
        otherNotes: journalEntry.otherNotes || "",
        workOn: journalEntry.workOn || "",
        partners: journalEntry.partners.map(name => ({ name })),
      };
    }
    
    // Default values for new entries
    return {
      date: new Date(),
      duration: 60,
      type: JournalEntryType.CLASS,
      giNoGi: JournalEntryGiNoGi.GI,
      area: JournalEntryArea.GUARD,
      feeling: JournalEntryFeeling.ENERGIZED,
      questions: "",
      location: "",
      professor: "",
      depthNotes: "",
      otherNotes: "",
      workOn: "",
      partners: [],
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<JournalFormData>({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(journalEntryFormValidation),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "partners",
  });
  const [partnerInput, setPartnerInput] = useState("");

  const handleInputChange = (
    field: keyof JournalFormData,
    value: string | number | { name: string }[]
  ) => {
    setValue(field, value);
  };
  const onSubmit = async (data: JournalFormData) => {
    startTransition(async () => {
      try {
        const baseData = {
          ...data,
          partners: data.partners.map((partner) => partner.name),
        };
        
        if (journalEntry) {
          const updateData: JournalEntryUpdateValidation = {
            ...baseData,
            id: journalEntry._id,
          };
          await (serverAction as (data: JournalEntryUpdateValidation) => Promise<void>)(updateData);
        } else {
          await (serverAction as (data: JournalEntryValidation) => Promise<void>)(baseData);
        }
        
      } catch (err) {
        console.error("Journal entry submission error:", err);
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 space-y-8"
      >
        <FieldGroup>
          <div className="space-y-6">
            <FieldTitle className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 block w-full">
              Session Details
            </FieldTitle>

            <FieldSet className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field data-invalid={!!errors.date}>
                <FieldLabel htmlFor="date">Date *</FieldLabel>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                      <PopoverTrigger asChild>
                        <Button id="date-picker" variant={"outline"} type="button">
                          <div className="flex flex-row justify-between items-center gap-2 w-full">
                            <span className="text-sm font-medium">
                              {format(field.value, "MM/dd/yyyy")}
                            </span>
                            <CalendarIcon className="size-3.5" />
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date);
                              setOpenDatePicker(false);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.date && <FieldError errors={[errors.date]} />}
              </Field>

              <Field data-invalid={!!errors.duration}>
                <FieldLabel htmlFor="duration">Duration (minutes) *</FieldLabel>
                <Input
                  type="number"
                  id="duration"
                  min="1"
                  max="480"
                  aria-invalid={!!errors.duration}
                  {...register("duration", { valueAsNumber: true })}
                  onChange={(e) =>
                    handleInputChange("duration", parseInt(e.target.value) || 0)
                  }
                />
                {errors.duration && <FieldError errors={[errors.duration]} />}
              </Field>
            </FieldSet>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field data-invalid={!!errors.type}>
                <FieldLabel htmlFor="type">Session Type *</FieldLabel>
                <Controller
                  name="type"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select session type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(JournalEntryType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </>
                  )}
                />
              </Field>

              <Field data-invalid={!!errors.giNoGi}>
                <FieldLabel htmlFor="giNoGi">Training Style *</FieldLabel>
                <Controller
                  name="giNoGi"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select training style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(JournalEntryGiNoGi).map((style) => (
                              <SelectItem key={style} value={style}>
                                {style}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </>
                  )}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field data-invalid={!!errors.area}>
                <FieldLabel htmlFor="area">Focus Area *</FieldLabel>
                <Controller
                  name="area"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select focus area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(JournalEntryArea).map((area) => (
                              <SelectItem key={area} value={area}>
                                {area}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </>
                  )}
                />
              </Field>

              <Field data-invalid={!!errors.feeling}>
                <FieldLabel htmlFor="feeling">How did you feel?</FieldLabel>
                <Controller
                  name="feeling"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Select feeling" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(JournalEntryFeeling).map((feeling) => (
                              <SelectItem key={feeling} value={feeling}>
                                {feeling}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </>
                  )}
                />
              </Field>
            </div>

            <Field data-invalid={!!errors.location}>
              <FieldLabel htmlFor="location">Training Location *</FieldLabel>
              <Input
                type="text"
                id="location"
                aria-invalid={!!errors.location}
                {...register("location")}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Gracie Barra Downtown, Alliance BJJ..."
              />
              {errors.location && <FieldError errors={[errors.location]} />}
            </Field>

            <Field data-invalid={!!errors.professor}>
              <FieldLabel htmlFor="professor">Instructor/Professor</FieldLabel>
              <Input
                type="text"
                id="professor"
                aria-invalid={!!errors.professor}
                {...register("professor")}
                onChange={(e) => handleInputChange("professor", e.target.value)}
                placeholder="e.g., Professor Silva, Coach Johnson..."
              />
              {errors.professor && <FieldError errors={[errors.professor]} />}
            </Field>
          </div>

          <Field>
            <FieldSet>
              <FieldTitle className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 block w-full">
                Training Partners
              </FieldTitle>

              <FieldLabel htmlFor="partnerInput">
                Add Training Partners
              </FieldLabel>
              <div className="flex gap-2">
                <Input
                  type="text"
                  id="partnerInput"
                  value={partnerInput}
                  onChange={(e) => setPartnerInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (partnerInput.trim()) {
                        append({ name: partnerInput.trim() });
                        setPartnerInput("");
                      }
                    }
                  }}
                  placeholder="Enter partner name..."
                  className="flex-5"
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (partnerInput.trim()) {
                      append({ name: partnerInput.trim() });
                      setPartnerInput("");
                    }
                  }}
                  className="flex-1"
                >
                  Add
                </Button>
              </div>
              <div>
                {fields.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {fields.map((field, index) => (
                      <Badge
                        key={field.id}
                        className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-sm px-3 py-1"
                      >
                        <input
                          {...register(`partners.${index}.name` as const)}
                          className="bg-transparent border-none outline-none text-blue-700"
                          readOnly
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </FieldSet>
          </Field>

          <FieldSet>
            <FieldTitle className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 block w-full">
              Notes & Insights
            </FieldTitle>

            <Field data-invalid={!!errors.depthNotes}>
              <FieldLabel htmlFor="depthNotes">
                Session Notes * (What happened, techniques worked on, etc.)
              </FieldLabel>
              <Textarea
                id="depthNotes"
                rows={6}
                aria-invalid={!!errors.depthNotes}
                {...register("depthNotes")}
                onChange={(e) =>
                  handleInputChange("depthNotes", e.target.value)
                }
                placeholder="Describe what you worked on, techniques learned, rolls you had, etc..."
              />
              {errors.depthNotes && <FieldError errors={[errors.depthNotes]} />}
            </Field>

            <Field data-invalid={!!errors.questions}>
              <FieldLabel htmlFor="questions">
                Questions or Things to Ask
              </FieldLabel>
              <Textarea
                id="questions"
                rows={3}
                aria-invalid={!!errors.questions}
                {...register("questions")}
                onChange={(e) => handleInputChange("questions", e.target.value)}
                placeholder="Any questions you have about techniques, positions, or concepts from today's session..."
              />
              {errors.questions && <FieldError errors={[errors.questions]} />}
            </Field>

            <Field data-invalid={!!errors.workOn}>
              <FieldLabel htmlFor="workOn">What to Work On Next</FieldLabel>
              <Textarea
                id="workOn"
                rows={3}
                aria-invalid={!!errors.workOn}
                {...register("workOn")}
                onChange={(e) => handleInputChange("workOn", e.target.value)}
                placeholder="What specific techniques or positions do you want to focus on in upcoming sessions?"
              />
              {errors.workOn && <FieldError errors={[errors.workOn]} />}
            </Field>

            <Field data-invalid={!!errors.otherNotes}>
              <FieldLabel htmlFor="otherNotes">Additional Notes</FieldLabel>
              <Textarea
                id="otherNotes"
                rows={3}
                aria-invalid={!!errors.otherNotes}
                {...register("otherNotes")}
                onChange={(e) =>
                  handleInputChange("otherNotes", e.target.value)
                }
                placeholder="Any other thoughts, observations, or insights from your training..."
              />
              {errors.otherNotes && <FieldError errors={[errors.otherNotes]} />}
            </Field>
          </FieldSet>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => window.history.back()}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending 
                ? (journalEntry ? "Updating Entry..." : "Creating Entry...") 
                : (journalEntry ? "Update Journal Entry" : "Create Journal Entry")
              }
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
