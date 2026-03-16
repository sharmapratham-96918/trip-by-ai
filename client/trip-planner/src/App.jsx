import React, { useEffect, useState } from "react";
import {
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Lightbulb,
  Plane,
  IndianRupee,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { genratePlan } from "./features/trip/tripSlice";



const App = () => {

  const { travelPlan, isLoading, isSUccess, isError, message } = useSelector(state => state.trip)

  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    budget: "",
  })

  const { from, to, budget } = formData

  const handelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handelSubmit = (e) => {
    e.preventDefault()

    dispatch(genratePlan(formData))
  }


  useEffect(() => {
    if (isError && message) {
      window.alert(message)
    }
  }, [isError, message])


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
        <h1 className="text-center text-4xl">Generating Travel Plan ...</h1>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <Plane className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold mb-3 tracking-tight">
            AI Trip Planner
          </h1>
          <p className="text-xl text-purple-100">
            Your perfect journey awaits - let AI craft your adventure
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-violet-50"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8 pb-16">
        {/* Input Form */}
        <form
          onSubmit={handelSubmit}
          className="bg-white rounded-3xl shadow-2xl shadow-purple-200/50 p-8 mb-8 border border-purple-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-violet-600" />
            Plan Your Trip
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                name="from"
                value={from}
                onChange={handelChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                name="to"
                value={to}
                onChange={handelChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget (₹)
              </label>
              <input
                type="number"
                name="budget"
                value={budget}
                onChange={handelChange}
                placeholder="20000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
              />
            </div>
          </div>

          {/* Button */}
          <button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg">
            Generate My Trip Plan
          </button>

        </form>

        {/* RESULT UI — static preview example */}
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-4xl font-bold mb-4">{travelPlan?.plan?.destination}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <Clock className="w-6 h-6" />
                <div>
                  <p className="text-sm text-purple-100">Duration</p>
                  <p className="text-lg font-semibold">{travelPlan?.plan?.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <IndianRupee className="w-6 h-6" />
                <div>
                  <p className="text-sm text-purple-100">Estimated Cost</p>
                  <p className="text-lg font-semibold">{travelPlan?.plan?.estimated_cost_in_inr
                  }</p>
                </div>
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-violet-600" />
              Daily Itinerary
            </h3>
            <div className="space-y-4">
              {travelPlan?.plan?.itinerary?.map((p) => (
                <div
                  key={p.day}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6"
                >
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    Day {p.day} – {p.title}
                  </h4>
                  <p className="text-gray-600">{p.description}</p>
                </div>
              ))}
            </div>


          </div>


          {/* Tips */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-amber-600" />
              Pro Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {travelPlan?.plan?.tips?.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
