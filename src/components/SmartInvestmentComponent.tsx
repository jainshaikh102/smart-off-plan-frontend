import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Banknote,
  Calculator,
  CreditCard,
  DollarSign,
  PieChart,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

interface Project {
  id: number;
  name: string;
  location: string;
  price: string;
  min_price?: number;
  [key: string]: any;
}

interface SmartInvestmentComponentProps {
  project: Project;
}

const SmartInvestmentComponent = ({
  project,
}: SmartInvestmentComponentProps) => {
  const [isInvestmentCalculatorOpen, setIsInvestmentCalculatorOpen] =
    useState(false);
  const [calculatorTab, setCalculatorTab] = useState("roi");

  const getPropertyPrice = useCallback((): number => {
    // Try to get price from min_price first (most accurate)
    if (project?.min_price && project.min_price > 0) {
      return project.min_price;
    }

    // Try to parse from formatted price string
    if (project?.price) {
      const numericValue = project.price.replace(/[^0-9.]/g, "");
      const parsed = parseFloat(numericValue);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }

    // Return 0 if no valid price found
    return 0;
  }, [project?.min_price, project?.price]);

  const [investmentData, setInvestmentData] = useState({
    propertyPrice: getPropertyPrice(),
    downPayment: 25,
    mortgageTerm: 25,
    interestRate: 4.5,
    expectedRentalYield: 8.5,
    capitalAppreciation: 6,
    holdingPeriod: 10,
    maintenanceCosts: 2,
    managementFees: 5,
  });

  const calculateMortgagePayment = () => {
    const principal =
      investmentData.propertyPrice * (1 - investmentData.downPayment / 100);
    const monthlyRate = investmentData.interestRate / 100 / 12;
    const numPayments = investmentData.mortgageTerm * 12;

    if (monthlyRate === 0) return principal / numPayments;

    return (
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    );
  };

  const calculateAnnualRentalIncome = () => {
    return (
      investmentData.propertyPrice * (investmentData.expectedRentalYield / 100)
    );
  };

  const calculateNetRentalIncome = () => {
    const grossRental = calculateAnnualRentalIncome();
    const maintenanceCosts =
      investmentData.propertyPrice * (investmentData.maintenanceCosts / 100);
    const managementFees = grossRental * (investmentData.managementFees / 100);
    return grossRental - maintenanceCosts - managementFees;
  };

  const calculateCashOnCash = () => {
    const downPaymentAmount =
      investmentData.propertyPrice * (investmentData.downPayment / 100);
    const netRentalIncome = calculateNetRentalIncome();
    const annualMortgagePayments = calculateMortgagePayment() * 12;
    const cashFlow = netRentalIncome - annualMortgagePayments;
    return (cashFlow / downPaymentAmount) * 100;
  };

  const calculateTotalROI = () => {
    const downPaymentAmount =
      investmentData.propertyPrice * (investmentData.downPayment / 100);
    const futureValue =
      investmentData.propertyPrice *
      Math.pow(
        1 + investmentData.capitalAppreciation / 100,
        investmentData.holdingPeriod
      );
    const totalCashFlow =
      calculateNetRentalIncome() * investmentData.holdingPeriod -
      calculateMortgagePayment() * 12 * investmentData.holdingPeriod;
    const totalReturn =
      futureValue - investmentData.propertyPrice + totalCashFlow;
    return (totalReturn / downPaymentAmount) * 100;
  };

  useEffect(() => {
    setInvestmentData((prev) => ({
      ...prev,
      propertyPrice: getPropertyPrice(),
    }));
  }, [getPropertyPrice]);

  const handleUpdateInvestmentData = (
    field: string,
    value: number | number[]
  ) => {
    setInvestmentData((prev) => ({
      ...prev,
      [field]: Array.isArray(value) ? value[0] : value,
    }));
  };

  return (
    <div>
      <Dialog
        open={isInvestmentCalculatorOpen}
        onOpenChange={setIsInvestmentCalculatorOpen}
      >
        <DialogTrigger asChild>
          <Button
            size="lg"
            variant="outline"
            className="border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355]/10"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Smart Investment
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-6xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6 border-b border-beige">
            <DialogTitle className="text-3xl text-[#8b7355] flex items-center">
              <TrendingUp className="w-8 h-8 mr-3 text-gold" />
              Investment Calculator
            </DialogTitle>
            <DialogDescription className="text-warm-gray mt-2 text-lg">
              Comprehensive ROI analysis for {project.name}
            </DialogDescription>
          </DialogHeader>

          <div className="py-8">
            <Tabs
              value={calculatorTab}
              onValueChange={setCalculatorTab}
              className="w-full"
            >
              <div className="relative w-full">
                <TabsList className="w-full h-auto flex flex-nowrap md:grid md:grid-cols-3 rounded-xl p-2 overflow-x-auto gap-2 md:gap-0 mb-8">
                  <TabsTrigger
                    value="roi"
                    className="flex items-center rounded-lg flex-shrink-0 min-w-[120px] text-sm px-3 py-2"
                  >
                    <PieChart className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">ROI Analysis</span>
                    <span className="sm:hidden">ROI</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="mortgage"
                    className="flex items-center rounded-lg flex-shrink-0 min-w-[120px] text-sm px-3 py-2"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Mortgage
                  </TabsTrigger>
                  <TabsTrigger
                    value="rental"
                    className="flex items-center rounded-lg flex-shrink-0 min-w-[120px] text-sm px-3 py-2"
                  >
                    <Banknote className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Rental Yield</span>
                    <span className="sm:hidden">Rental</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* ROI Analysis Tab */}
              <TabsContent value="roi" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="rounded-2xl border-0 shadow-xl">
                    <CardHeader className="p-6">
                      <CardTitle className="text-[#8b7355] text-xl">
                        Investment Parameters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-8">
                      <div>
                        <Label className="flex items-center justify-between mb-3">
                          <span>Property Price</span>
                          <span className="text-gold font-medium">
                            AED {investmentData.propertyPrice.toLocaleString()}
                          </span>
                        </Label>
                        <Slider
                          value={[investmentData.propertyPrice]}
                          onValueChange={(value) =>
                            handleUpdateInvestmentData("propertyPrice", value)
                          }
                          max={10000000}
                          min={500000}
                          step={50000}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="flex items-center justify-between mb-3">
                          <span>Down Payment</span>
                          <span className="text-gold font-medium">
                            {investmentData.downPayment}%
                          </span>
                        </Label>
                        <Slider
                          value={[investmentData.downPayment]}
                          onValueChange={(value) =>
                            handleUpdateInvestmentData("downPayment", value)
                          }
                          max={50}
                          min={10}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="flex items-center justify-between mb-3">
                          <span>Expected Rental Yield</span>
                          <span className="text-gold font-medium">
                            {investmentData.expectedRentalYield}%
                          </span>
                        </Label>
                        <Slider
                          value={[investmentData.expectedRentalYield]}
                          onValueChange={(value) =>
                            handleUpdateInvestmentData(
                              "expectedRentalYield",
                              value
                            )
                          }
                          max={15}
                          min={4}
                          step={0.5}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="flex items-center justify-between mb-3">
                          <span>Capital Appreciation</span>
                          <span className="text-gold font-medium">
                            {investmentData.capitalAppreciation}%
                          </span>
                        </Label>
                        <Slider
                          value={[investmentData.capitalAppreciation]}
                          onValueChange={(value) =>
                            handleUpdateInvestmentData(
                              "capitalAppreciation",
                              value
                            )
                          }
                          max={12}
                          min={2}
                          step={0.5}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="flex items-center justify-between mb-3">
                          <span>Holding Period</span>
                          <span className="text-gold font-medium">
                            {investmentData.holdingPeriod} years
                          </span>
                        </Label>
                        <Slider
                          value={[investmentData.holdingPeriod]}
                          onValueChange={(value) =>
                            handleUpdateInvestmentData("holdingPeriod", value)
                          }
                          max={20}
                          min={3}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-0 shadow-xl">
                    <CardHeader className="p-6">
                      <CardTitle className="text-[#8b7355] text-xl">
                        Investment Returns
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gold/10 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-warm-gray">
                              Cash on Cash Return
                            </span>
                            <TrendingUp className="w-5 h-5 text-gold" />
                          </div>
                          <div className="text-3xl text-[#8b7355] font-bold">
                            {calculateCashOnCash().toFixed(1)}%
                          </div>
                          <div className="text-xs text-warm-gray mt-2">
                            Annual cash flow return
                          </div>
                        </div>

                        <div className="bg-gold/10 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-warm-gray">
                              Total ROI
                            </span>
                            <Target className="w-5 h-5 text-gold" />
                          </div>
                          <div className="text-3xl text-[#8b7355] font-bold">
                            {calculateTotalROI().toFixed(1)}%
                          </div>
                          <div className="text-xs text-warm-gray mt-2">
                            Over {investmentData.holdingPeriod} years
                          </div>
                        </div>

                        <div className="bg-gold/10 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-warm-gray">
                              Monthly Cash Flow
                            </span>
                            <DollarSign className="w-5 h-5 text-gold" />
                          </div>
                          <div className="text-2xl text-[#8b7355] font-bold">
                            AED{" "}
                            {(
                              calculateNetRentalIncome() / 12 -
                              calculateMortgagePayment()
                            ).toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </div>
                          <div className="text-xs text-warm-gray mt-2">
                            Net monthly income
                          </div>
                        </div>

                        <div className="bg-gold/10 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-warm-gray">
                              Initial Investment
                            </span>
                            <Wallet className="w-5 h-5 text-gold" />
                          </div>
                          <div className="text-xl text-[#8b7355] font-bold">
                            AED{" "}
                            {(
                              (investmentData.propertyPrice *
                                investmentData.downPayment) /
                              100
                            ).toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </div>
                          <div className="text-xs text-warm-gray mt-2">
                            Down payment required
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-beige">
                        <h4 className="text-[#8b7355] mb-4 font-medium">
                          Investment Summary
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-warm-gray">
                              Property Value:
                            </span>
                            <span className="text-[#8b7355] font-medium">
                              AED{" "}
                              {investmentData.propertyPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-warm-gray">
                              Down Payment:
                            </span>
                            <span className="text-[#8b7355] font-medium">
                              AED{" "}
                              {(
                                (investmentData.propertyPrice *
                                  investmentData.downPayment) /
                                100
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-warm-gray">Loan Amount:</span>
                            <span className="text-[#8b7355] font-medium">
                              AED{" "}
                              {(
                                (investmentData.propertyPrice *
                                  (100 - investmentData.downPayment)) /
                                100
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-warm-gray">
                              Annual Rental Income:
                            </span>
                            <span className="text-[#8b7355] font-medium">
                              AED{" "}
                              {calculateAnnualRentalIncome().toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-beige pt-3">
                            <span className="text-warm-gray">
                              Future Property Value:
                            </span>
                            <span className="text-gold font-medium">
                              AED{" "}
                              {(
                                investmentData.propertyPrice *
                                Math.pow(
                                  1 + investmentData.capitalAppreciation / 100,
                                  investmentData.holdingPeriod
                                )
                              ).toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Mortgage Tab */}
              <TabsContent value="mortgage" className="space-y-8">
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gold mx-auto mb-4" />
                  <h3 className="text-xl text-[#8b7355] mb-4">
                    Mortgage Calculator
                  </h3>
                  <p className="text-warm-gray">
                    Detailed mortgage calculations and payment breakdown.
                  </p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    <div className="bg-beige/30 p-6 rounded-xl">
                      <div className="text-2xl text-[#8b7355] font-bold">
                        AED{" "}
                        {calculateMortgagePayment().toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </div>
                      <div className="text-sm text-warm-gray">
                        Monthly Payment
                      </div>
                    </div>
                    <div className="bg-beige/30 p-6 rounded-xl">
                      <div className="text-2xl text-[#8b7355] font-bold">
                        {investmentData.interestRate}%
                      </div>
                      <div className="text-sm text-warm-gray">
                        Interest Rate
                      </div>
                    </div>
                    <div className="bg-beige/30 p-6 rounded-xl">
                      <div className="text-2xl text-[#8b7355] font-bold">
                        {investmentData.mortgageTerm}
                      </div>
                      <div className="text-sm text-warm-gray">Years</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Rental Yield Tab */}
              <TabsContent value="rental" className="space-y-8">
                <div className="text-center py-12">
                  <Banknote className="w-16 h-16 text-gold mx-auto mb-4" />
                  <h3 className="text-xl text-[#8b7355] mb-4">
                    Rental Yield Analysis
                  </h3>
                  <p className="text-warm-gray">
                    Comprehensive rental income and yield analysis.
                  </p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    <div className="bg-beige/30 p-6 rounded-xl">
                      <div className="text-2xl text-[#8b7355] font-bold">
                        {investmentData.expectedRentalYield}%
                      </div>
                      <div className="text-sm text-warm-gray">Gross Yield</div>
                    </div>
                    <div className="bg-beige/30 p-6 rounded-xl">
                      <div className="text-2xl text-[#8b7355] font-bold">
                        AED{" "}
                        {calculateNetRentalIncome().toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </div>
                      <div className="text-sm text-warm-gray">
                        Net Annual Income
                      </div>
                    </div>
                    <div className="bg-beige/30 p-6 rounded-xl">
                      <div className="text-2xl text-[#8b7355] font-bold">
                        AED{" "}
                        {(calculateNetRentalIncome() / 12).toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 0,
                          }
                        )}
                      </div>
                      <div className="text-sm text-warm-gray">
                        Monthly Income
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SmartInvestmentComponent;
