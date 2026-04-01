"use client"

import type { ReactNode } from "react"
import { ChangeEvent, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Upload,
  UserCircle2,
} from "lucide-react"
import { registerFarmer } from "./actions"
import { COUNTY_NAMES, KENYA_LOCATIONS } from "@/lib/kenya-locations"
import { FarmBoundaryTracker } from "@/components/FarmBoundaryTracker"

type PolicyOption = {
  id: string
  name: string
  cropType: string
  region: string
}

type UploadKind = "farmer" | "farm"

async function uploadImage(file: File, kind: UploadKind) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("kind", kind)

  const response = await fetch("/api/uploads/image", {
    method: "POST",
    body: formData,
  })

  const payload = await response.json()
  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? "Upload failed")
  }

  return payload.imageUrl as string
}

function UploadTile({
  label,
  description,
  icon,
  imageUrl,
  uploading,
  capture,
  onSelect,
}: {
  label: string
  description: string
  icon: ReactNode
  imageUrl: string | null
  uploading: boolean
  capture?: "user" | "environment"
  onSelect: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{label}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>

      <div className="mb-3 overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white">
        {imageUrl ? (
          <img src={imageUrl} alt={label} className="h-40 w-full object-cover" />
        ) : (
          <div className="flex h-40 items-center justify-center px-4 text-center text-sm text-slate-400">
            No image uploaded yet
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={capture}
        className="hidden"
        onChange={onSelect}
      />

      <Button
        type="button"
        variant="outline"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="w-full"
      >
        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
        {imageUrl ? "Replace Photo" : "Take or Upload Photo"}
      </Button>
    </div>
  )
}

export function RegisterClient({
  policies,
  defaultCounty,
  defaultConstituency,
}: {
  policies: PolicyOption[]
  defaultCounty: string
  defaultConstituency: string
}) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [uploadingFarmerPhoto, setUploadingFarmerPhoto] = useState(false)
  const [uploadingFarmPhoto, setUploadingFarmPhoto] = useState(false)

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [policyId, setPolicyId] = useState(policies[0]?.id ?? "")
  const [county, setCounty] = useState(defaultCounty)
  const [constituency, setConstituency] = useState(defaultConstituency)
  const [acreage, setAcreage] = useState("2.5")
  const [cropType, setCropType] = useState(policies[0]?.cropType ?? "Maize")
  const [coordinates, setCoordinates] = useState<Array<{ lat: number; lng: number }>>([])
  const [farmerPhotoUrl, setFarmerPhotoUrl] = useState<string | null>(null)
  const [farmPhotoUrl, setFarmPhotoUrl] = useState<string | null>(null)

  const hasPolicies = policies.length > 0

  const selectedPolicy = policies.find((policy) => policy.id === policyId) ?? null

  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>, kind: UploadKind) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setFormError("Please choose a valid image file.")
      event.target.value = ""
      return
    }

    if (file.size > 6 * 1024 * 1024) {
      setFormError("Each photo must be 6MB or smaller.")
      event.target.value = ""
      return
    }

    setFormError("")
    kind === "farmer" ? setUploadingFarmerPhoto(true) : setUploadingFarmPhoto(true)

    try {
      const imageUrl = await uploadImage(file, kind)
      if (kind === "farmer") {
        setFarmerPhotoUrl(imageUrl)
      } else {
        setFarmPhotoUrl(imageUrl)
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Image upload failed.")
    } finally {
      kind === "farmer" ? setUploadingFarmerPhoto(false) : setUploadingFarmPhoto(false)
      event.target.value = ""
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setFormError("")

    try {
      await registerFarmer({
        fullName,
        phone,
        idNumber,
        policyId,
        county,
        constituency,
        acreage: parseFloat(acreage),
        cropType,
        coordinates,
        farmerPhotoUrl,
        farmPhotoUrl,
      })
      setStep(5)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Registration failed.")
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
              <input type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} className="w-full rounded-xl border-slate-200 bg-white/50 px-4 py-3 shadow-sm focus:ring-2 focus:ring-primary" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Phone Number</label>
              <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-xl border-slate-200 bg-white/50 px-4 py-3 shadow-sm focus:ring-2 focus:ring-primary" placeholder="0700 000 000" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">National ID</label>
              <input type="text" value={idNumber} onChange={(event) => setIdNumber(event.target.value)} className="w-full rounded-xl border-slate-200 bg-white/50 px-4 py-3 shadow-sm focus:ring-2 focus:ring-primary" placeholder="ID Number" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">County</label>
              <select
                value={county}
                onChange={(event) => {
                  setCounty(event.target.value)
                  setConstituency("")
                  setCoordinates([])
                }}
                className="w-full rounded-xl border-slate-200 bg-white/50 px-4 py-3 shadow-sm focus:ring-2 focus:ring-primary"
              >
                <option value="">Select county</option>
                {COUNTY_NAMES.map((countyName) => (
                  <option key={countyName} value={countyName}>{countyName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Constituency</label>
              <select
                value={constituency}
                onChange={(event) => {
                  setConstituency(event.target.value)
                  setCoordinates([])
                }}
                disabled={!county}
                className="w-full rounded-xl border-slate-200 bg-white/50 px-4 py-3 shadow-sm focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                <option value="">Select constituency</option>
                {county && KENYA_LOCATIONS[county]?.constituencies.map((constituencyName) => (
                  <option key={constituencyName} value={constituencyName}>{constituencyName}</option>
                ))}
              </select>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            {!hasPolicies ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                No active policy is available for this agent yet. Ask the insurer to publish an active policy before onboarding farmers.
              </div>
            ) : null}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Select Policy / Product</label>
              <select
                value={policyId}
                onChange={(event) => {
                  const nextPolicyId = event.target.value
                  setPolicyId(nextPolicyId)
                  const nextPolicy = policies.find((policy) => policy.id === nextPolicyId)
                  if (nextPolicy) {
                    setCropType(nextPolicy.cropType)
                  }
                }}
                disabled={!hasPolicies}
                className="w-full rounded-xl border-slate-200 bg-white/50 px-4 py-3 shadow-sm focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                {hasPolicies ? null : <option value="">No active policies</option>}
                {policies.map((policy) => (
                  <option key={policy.id} value={policy.id}>
                    {policy.name} ({policy.cropType}) - {policy.region}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Crop Type</label>
              <input type="text" value={cropType} onChange={(event) => setCropType(event.target.value)} className="w-full rounded-xl border-slate-200 bg-white/50 px-4 py-3 shadow-sm focus:ring-2 focus:ring-primary" placeholder="e.g. Maize" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Estimated Acreage</label>
              <input
                type="number"
                step="0.01"
                value={acreage}
                onChange={(event) => setAcreage(event.target.value)}
                className="w-full rounded-xl border-slate-200 bg-white/50 px-4 py-3 shadow-sm focus:ring-2 focus:ring-primary"
                placeholder="Auto-filled after GPS mapping"
              />
              <p className="mt-1 text-xs text-slate-500">
                This updates automatically after the farm boundary is captured with stronger GPS points.
              </p>
            </div>
            {selectedPolicy ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
                <p className="font-semibold">{selectedPolicy.name}</p>
                <p className="mt-1">Crop: {selectedPolicy.cropType}</p>
                <p>Coverage region: {selectedPolicy.region}</p>
              </div>
            ) : null}
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <FarmBoundaryTracker
              onBoundaryComplete={(trackedCoordinates, trackedAcreage) => {
                setCoordinates(trackedCoordinates)
                if (trackedAcreage > 0) {
                  setAcreage(trackedAcreage.toFixed(2))
                }
              }}
            />
            <p className="text-center text-xs text-slate-500">
              GPS boundary will be saved under {constituency || "constituency"}, {county || "county"}.
            </p>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <p className="text-center text-sm text-slate-500">
              Capture or upload a clear photo of the farmer and one photo of the farm. These will be stored securely in Cloudinary.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <UploadTile
                label="Farmer Photo"
                description="Use the front camera or upload from gallery."
                icon={<UserCircle2 className="h-7 w-7" />}
                imageUrl={farmerPhotoUrl}
                uploading={uploadingFarmerPhoto}
                capture="user"
                onSelect={(event) => handlePhotoUpload(event, "farmer")}
              />
              <UploadTile
                label="Farm Photo"
                description="Use the back camera or upload a field image."
                icon={<Camera className="h-7 w-7" />}
                imageUrl={farmPhotoUrl}
                uploading={uploadingFarmPhoto}
                capture="environment"
                onSelect={(event) => handlePhotoUpload(event, "farm")}
              />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <p>Location: {constituency || "constituency"}, {county || "county"}</p>
              <p className="mt-1">Boundary points captured: {coordinates.length}</p>
              <p className="mt-1">Estimated acreage: {acreage || "0.00"} acres</p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={
                loading ||
                uploadingFarmerPhoto ||
                uploadingFarmPhoto ||
                !fullName.trim() ||
                !phone.trim() ||
                !idNumber.trim() ||
                !county ||
                !constituency ||
                !policyId ||
                coordinates.length < 3
              }
              className="mt-4 h-12 w-full bg-emerald-600 text-lg font-bold text-white hover:bg-emerald-700 disabled:bg-slate-300 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Completing Registration...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6 py-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Registration Complete</h3>
            <p className="text-slate-500">The farmer, farm boundary, photos, and policy enrollment have been saved successfully.</p>
          </div>
        )
      default:
        return null
    }
  }

  const steps = [
    "Personal Details",
    "Policy Selection",
    "Farm Mapped",
    "Photos & Submit",
  ]

  const nextDisabled =
    (step === 1 && (!fullName || !phone || !idNumber || !county || !constituency)) ||
    (step === 2 && !policyId) ||
    (step === 3 && coordinates.length === 0)

  return (
    <div className="mx-auto flex h-full max-w-md flex-col">
      <div className="mb-6 flex space-x-2">
        {steps.map((stepLabel, index) => (
          <div
            key={stepLabel}
            className={`h-2 flex-1 rounded-full ${Math.min(step, 4) > index ? "bg-primary" : "bg-slate-200"}`}
          />
        ))}
      </div>

      <Card className="relative flex-1 border border-slate-100 pb-16 shadow-premium">
        <CardHeader className="border-b border-slate-100 pb-4">
          <Badge className="mb-2 w-fit bg-primary/20 text-primary-dark">Step {Math.min(step, 4)} of 4</Badge>
          <CardTitle className="text-xl text-slate-800">{steps[Math.min(step, 4) - 1]}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {formError ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          ) : null}
          {renderStepContent()}
        </CardContent>
        {step < 4 ? (
          <div className="absolute bottom-6 left-6 right-6 flex justify-between gap-3">
            <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button onClick={() => setStep(Math.min(4, step + 1))} disabled={nextDisabled}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  )
}
