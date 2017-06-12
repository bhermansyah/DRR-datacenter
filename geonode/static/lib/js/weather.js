// (c) Marek Mojzik, 2015-2017
MapOptions %= function(A, B, I, k) {
    function fa(a, b) {
        return (a % b + b) % b
    }

    function Ba(a, b) {
        a.onmousedown = function(c) {
            var f = b.call(this, c || A.event);
            f && f.qf && (A.getSelection ? (c = A.getSelection()) && c.removeAllRanges && c.removeAllRanges() : B.selection && B.selection.empty && B.selection.empty(), B.onmousemove = function(a) {
                return f.qf.call(this, a || A.event, 1)
            }, B.onmouseup = function(b) {
                B.onmousemove = B.onmouseup = null;
                if (f.rf) return f.rf.call(a, b || A.event)
            })
        };
        a.ondragstart = function() {
            return !1
        };
        a.ontouchstart = function(c) {
            if (1 ==
                c.touches.length) {
                var f = b.call(a, c.touches[0]);
                if (f && f.qf) {
                    var v = 0,
                        y = {},
                        h = [];
                    B.ontouchstart = function(b) {
                        for (var c = 0; c < b.changedTouches.length; c++) y[b.changedTouches[c].identifier] = h.length, h.push(b.changedTouches[c]);
                        if (2 == h.length) return b = h[1].clientX - h[0].clientX, c = h[1].clientY - h[0].clientY, f.onchange && f.onchange.call(a, b / 2, c / 2), v = k.sqrt(b * b + c * c), !1
                    };
                    B.ontouchmove = function(b) {
                        B.oncontextmenu = function() {
                            return !1
                        };
                        for (var c = 0; c < b.changedTouches.length; c++) h[y[b.changedTouches[c].identifier]] = b.changedTouches[c];
                        b = b.touches[0];
                        c = 1;
                        if (1 < h.length) {
                            var c = h[0].clientX - h[1].clientX,
                                d = h[0].clientY - h[1].clientY;
                            b = {
                                clientX: (h[0].clientX + h[1].clientX) / 2,
                                clientY: (h[0].clientY + h[1].clientY) / 2
                            };
                            c = k.sqrt(c * c + d * d) / v
                        }
                        return f.qf.call(a, b, c) || !1
                    };
                    B.ontouchend = function(b) {
                        for (var c = [], d = 0; d < b.changedTouches.length; d++) c.push(h.splice(y[b.changedTouches[d].identifier], 1)[0]);
                        if (c[0] && !(1 < h.length))
                            if (1 == h.length) f.onchange && f.onchange.call(a, (h[0].clientX - c[0].clientX) / 2, (h[0].clientY - c[0].clientY) / 2), v = 0;
                            else if (B.ontouchstart =
                            null, B.ontouchmove = null, B.ontouchend = null, B.ontouchcancel = null, B.oncontextmenu = null, f.rf) return f.rf.call(a, b.changedTouches[0])
                    };
                    return !1
                }
            }
        }
    }

    function Y() {
        if (A.Worker && A.URL && "function" == typeof A.Blob && !A.setImmediate && !pa) {
            this.vj = ("hardwareConcurrency" in navigator ? navigator.hardwareConcurrency : 4) - 1;
            this.Wh = [];
            var a = [],
                b;
            for (b in Z) a.push(b + ":" + Z[b].toString());
            a = "{" + a.join(",") + "}";
            a = URL.createObjectURL(new Blob(["onmessage = (" + this.vl.toString() + ")(" + a + ")"], {
                type: "application/javascript"
            }));
            for (b =
                0; b < this.vj; b++) {
                var c = new Worker(a);
                c.onmessage = this.onmessage.bind(this);
                this.Wh.push(c)
            }
            this.vg = 0;
            this.Gi = {}
        }
    }
    var qa = ("https:" == location.protocol ? "https:" : "http:") + "//asdc.immap.org/",
        pa = 1024 >= k.min(A.innerWidth, A.innerHeight) && /ipad|iphone|android|mobile/i.test(navigator.userAgent),
        Pa = pa ? 80 : 160,
        Ia = pa ? 512 : 1024,
        Ja = pa ? 4 : 9,
        Ka = k.sqrt(5) / 2 + .5,
        Qa = qa + "images/logo-w.png",
        ta = [16, 9, Ka, 1, 3, 2, 4, 3, 5, 4, 1, 1],
        Ca = [95, 90, 85, 80, 75],
        va = ["#FFF", "#000"],
        Ra = ["#111", "rgba(255,255,255,0.7)"],
        ia = "off normal strong soft dark fast".split(" "),
        Sa = {
            normal: "0DAKtpv2A",
            dark: "0jAEIuk3a",
            strong: "0oAleyk2A",
            soft: "0xIAb9A9A",
            fast: "0tsdFPK3a"
        },
        Fa = {
            normal: "0Ddq9WAHA",
            strong: "0Jdq9SG_A",
            fast: "0Etq9wj-A",
            soft: "0gYAF-g8A",
            dark: "0Ddq9WAHa"
        },
        da = pa ? 10 : 50,
        Ta = qa + "tiles/",
        wa = ["", "#000", "#FFF"],
        Ua = {
            width: 512,
            height: 512,
            path: qa + "data/{time:yyyy/MM/dd}/{model}/tilled_world/hour_{time:HH}/{model}_{layer}_{tileX}_{tileY}_{time:yyyyMMdd_HH}.jpg?{cache}"
        },
        Da = {
            width: 720,
            height: 360,
            path: qa + "data/{time:yyyy/MM/dd}/{model}/whole_world/hour_{time:HH}/{model}_{layer}_{time:yyyyMMdd_HH}.jpg?{cache}"
        },
        ma = {
            width: 1440,
            height: 721,
            Cg: "13 km"
        },
        ya = {
            width: 1440,
            height: 699,
            Cg: "13 km",
            kf: 89.25,
            Ji: -85.5
        },
        D = {
            gfs: {
                start: I.gfsTimelineStart,
                end: I.gfsTimelineEnd,
                oe: I.gfsUpdated,
                ne: 6,
                source: "NOAA",
                Oh: "http://www.noaa.gov",
                Zf: "i",
                size: ma,
                Yd: 3,
                Kd: {
                    clouds: {},
                    "rain-3h": {},
                    "rain-ac": {
                        start: I.gfsAccumulationStart
                    },
                    pressure: {},
                    cape: {},
                    cin: {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    li: {
                        start: Date.UTC(2016, 9, 1, 0)
                    },
                    helicity: {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    temperature: {},
                    "temperature-950hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "temperature-925hpa": {
                        start: Date.UTC(2016,
                            7, 10, 0)
                    },
                    "temperature-900hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "temperature-850hpa": {},
                    "temperature-800hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "temperature-750hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "temperature-700hpa": {},
                    "temperature-650hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "temperature-600hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "temperature-500hpa": {},
                    "temperature-300hpa": {},
                    "temperature-200hpa": {
                        start: Date.UTC(2017, 0, 7, 0)
                    },
                    wind: {},
                    "wind-950hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "wind-925hpa": {
                        start: Date.UTC(2016, 7, 10,
                            0)
                    },
                    "wind-900hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "wind-850hpa": {},
                    "wind-800hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "wind-750hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "wind-700hpa": {},
                    "wind-650hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "wind-600hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "wind-500hpa": {},
                    "wind-300hpa": {},
                    "wind-200hpa": {
                        start: Date.UTC(2017, 0, 7, 0)
                    },
                    gust: {},
                    snow: {},
                    freezing: {}
                },
                Sd: !0
            },
            gem: {
                start: I.gemTimelineStart,
                end: I.gemTimelineEnd,
                oe: I.gemUpdated,
                ne: 12,
                source: "CMC",
                Oh: "https://www.canada.ca/en/index.html",
                Zf: "v",
                size: {
                    width: 1500,
                    height: 751,
                    Cg: "13 km"
                },
                Yd: 3,
                Kd: {
                    clouds: {},
                    "rain-3h": {},
                    "rain-ac": {
                        start: I.gemAccumulationStart
                    },
                    pressure: {},
                    temperature: {},
                    "temperature-950hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "temperature-925hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "temperature-900hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "temperature-850hpa": {},
                    "temperature-800hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "temperature-750hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "temperature-700hpa": {},
                    "temperature-600hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "temperature-500hpa": {},
                    "temperature-300hpa": {},
                    "temperature-200hpa": {
                        start: Date.UTC(2017, 0, 7, 0)
                    },
                    wind: {},
                    "wind-950hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "wind-925hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "wind-900hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "wind-850hpa": {},
                    "wind-800hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "wind-750hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "wind-700hpa": {},
                    "wind-600hpa": {
                        start: Date.UTC(2016, 7, 10, 0)
                    },
                    "wind-500hpa": {},
                    "wind-300hpa": {},
                    "wind-200hpa": {
                        start: Date.UTC(2017, 0, 7, 0)
                    },
                    snow: {}
                },
                Sd: !1
            },
            icon: {
                start: I.iconTimelineStart,
                end: I.iconTimelineEnd,
                oe: I.iconUpdated,
                ne: 6,
                source: "DWD",
                Oh: "http://www.dwd.de",
                Zf: "m",
                size: {
                    width: 2880,
                    height: 1441,
                    Cg: "7 km"
                },
                Yd: 1,
                Kd: {
                    clouds: {},
                    "rain-1h": {},
                    "rain-3h": {
                        Yd: 3
                    },
                    "rain-ac": {
                        start: I.iconAccumulationStart
                    },
                    pressure: {},
                    temperature: {},
                    "temperature-850hpa": {
                        size: ma
                    },
                    "temperature-700hpa": {
                        size: ma
                    },
                    "temperature-500hpa": {
                        size: ma
                    },
                    "temperature-300hpa": {
                        size: ma
                    },
                    wind: {},
                    "wind-850hpa": {
                        size: ma
                    },
                    "wind-700hpa": {
                        size: ma
                    },
                    "wind-500hpa": {
                        size: ma
                    },
                    "wind-300hpa": {
                        size: ma
                    },
                    gust: {},
                    wave: {
                        Yd: 3,
                        size: ya,
                        start: I["icon-waterTimelineStart"],
                        end: I["icon-waterTimelineEnd"],
                        oe: I["icon-waterUpdated"],
                        ne: 12,
                        Sd: !0
                    },
                    "wind-wave": {
                        Yd: 3,
                        size: ya,
                        start: I["icon-waterTimelineStart"],
                        end: I["icon-waterTimelineEnd"],
                        oe: I["icon-waterUpdated"],
                        ne: 12,
                        Sd: !0
                    },
                    "wind-wave-period": {
                        Yd: 3,
                        size: ya,
                        start: I["icon-waterTimelineStart"],
                        end: I["icon-waterTimelineEnd"],
                        oe: I["icon-waterUpdated"],
                        ne: 12,
                        Sd: !0
                    },
                    swell: {
                        Yd: 3,
                        size: ya,
                        start: I["icon-waterTimelineStart"],
                        end: I["icon-waterTimelineEnd"],
                        oe: I["icon-waterUpdated"],
                        ne: 12,
                        Sd: !0
                    },
                    "swell-period": {
                        Yd: 3,
                        size: ya,
                        start: I["icon-waterTimelineStart"],
                        end: I["icon-waterTimelineEnd"],
                        oe: I["icon-waterUpdated"],
                        ne: 12,
                        Sd: !0
                    }
                },
                Sd: !1
            }
        },
        X = ["icon", "gfs", "gem"],
        Va = I.iconAccumulationStart,
        aa = [{
                id: "temperature",
                kind: "altitude",
                f: [{
                        id: "temperature",
                        file: "teplota_2_m",
                        label: "temperature-ground",
                        Jd: !0
                    }, {
                        id: "temperature-950hpa",
                        file: "teplota_95000_pa",
                        h: "950hpa",
                        label: "950hpa"
                    }, {
                        id: "temperature-925hpa",
                        file: "teplota_92500_pa",
                        h: "925hpa",
                        label: "925hpa"
                    }, {
                        id: "temperature-900hpa",
                        file: "teplota_90000_pa",
                        h: "900hpa",
                        label: "900hpa"
                    }, {
                        id: "temperature-850hpa",
                        file: "teplota_85000_pa",
                        h: "850hpa",
                        label: "850hpa",
                        Jd: !0
                    }, {
                        id: "temperature-800hpa",
                        file: "teplota_80000_pa",
                        h: "800hpa",
                        label: "800hpa"
                    }, {
                        id: "temperature-750hpa",
                        file: "teplota_75000_pa",
                        h: "750hpa",
                        label: "750hpa"
                    }, {
                        id: "temperature-700hpa",
                        file: "teplota_70000_pa",
                        h: "700hpa",
                        label: "700hpa",
                        Jd: !0
                    }, {
                        id: "temperature-650hpa",
                        file: "teplota_65000_pa",
                        h: "650hpa",
                        label: "650hpa"
                    }, {
                        id: "temperature-600hpa",
                        file: "teplota_60000_pa",
                        h: "600hpa",
                        label: "600hpa"
                    }, {
                        id: "temperature-500hpa",
                        file: "teplota_50000_pa",
                        h: "500hpa",
                        label: "500hpa",
                        Jd: !0
                    },
                    {
                        id: "temperature-300hpa",
                        file: "teplota_30000_pa",
                        h: "300hpa",
                        label: "300hpa",
                        Jd: !0
                    }, {
                        id: "temperature-200hpa",
                        file: "teplota_20000_pa",
                        h: "200hpa",
                        label: "200hpa"
                    }
                ]
            }, {
                id: "rain",
                kind: "accumulation",
                f: [{
                    id: "rain-1h",
                    file: "srazky_1h"
                }, {
                    id: "rain-3h",
                    file: "srazky_3h",
                    zg: !0
                }, {
                    id: "rain-ac",
                    file: "srazky_ac",
                    Ah: !0
                }]
            }, {
                id: "clouds",
                file: "oblacnost"
            }, {
                id: "wind",
                kind: "altitude",
                f: [{
                    id: "wind",
                    file: ["vitr_u_10_m", "vitr_v_10_m"],
                    label: "wind-ground"
                }, {
                    id: "wind-950hpa",
                    file: ["vitr_u_95000_pa", "vitr_v_95000_pa"],
                    h: "950hpa",
                    label: "950hpa"
                }, {
                    id: "wind-925hpa",
                    file: ["vitr_u_92500_pa", "vitr_v_92500_pa"],
                    h: "925hpa",
                    label: "925hpa"
                }, {
                    id: "wind-900hpa",
                    file: ["vitr_u_90000_pa", "vitr_v_90000_pa"],
                    h: "900hpa",
                    label: "900hpa"
                }, {
                    id: "wind-850hpa",
                    file: ["vitr_u_85000_pa", "vitr_v_85000_pa"],
                    h: "850hpa",
                    label: "850hpa",
                    Jd: !0
                }, {
                    id: "wind-800hpa",
                    file: ["vitr_u_80000_pa", "vitr_v_80000_pa"],
                    h: "800hpa",
                    label: "800hpa"
                }, {
                    id: "wind-750hpa",
                    file: ["vitr_u_75000_pa", "vitr_v_75000_pa"],
                    h: "750hpa",
                    label: "750hpa"
                }, {
                    id: "wind-700hpa",
                    file: ["vitr_u_70000_pa",
                        "vitr_v_70000_pa"
                    ],
                    h: "700hpa",
                    label: "700hpa",
                    Jd: !0
                }, {
                    id: "wind-650hpa",
                    file: ["vitr_u_65000_pa", "vitr_v_65000_pa"],
                    h: "650hpa",
                    label: "650hpa"
                }, {
                    id: "wind-600hpa",
                    file: ["vitr_u_60000_pa", "vitr_v_60000_pa"],
                    h: "600hpa",
                    label: "600hpa"
                }, {
                    id: "wind-500hpa",
                    file: ["vitr_u_50000_pa", "vitr_v_50000_pa"],
                    h: "500hpa",
                    label: "500hpa",
                    Jd: !0
                }, {
                    id: "wind-300hpa",
                    file: ["vitr_u_30000_pa", "vitr_v_30000_pa"],
                    h: "300hpa",
                    label: "300hpa",
                    Jd: !0
                }, {
                    id: "wind-200hpa",
                    file: ["vitr_u_20000_pa", "vitr_v_20000_pa"],
                    h: "200hpa",
                    label: "200hpa"
                }]
            },
            {
                id: "gust",
                file: "vitr_naraz"
            }, {
                id: "pressure",
                file: "tlak"
            }, {
                id: "storm",
                kind: "storm",
                f: [{
                    id: "cape",
                    file: "cape",
                    description: "cape"
                }, {
                    id: "cin",
                    file: "cin",
                    description: "cin"
                }, {
                    id: "li",
                    file: "li",
                    description: "li"
                }, {
                    id: "helicity",
                    file: "helicity",
                    description: "helicity"
                }]
            }, {
                id: "wave",
                kind: "wave",
                f: [{
                        id: "wave",
                        file: "swh",
                        wd: "_water",
                        h: "wave-total"
                    }, {
                        id: "wind-wave",
                        file: "shww",
                        wd: "_water",
                        h: "wave-wind"
                    }, {
                        id: "wind-wave-period",
                        file: "mpww",
                        wd: "_water",
                        h: "wave-wind"
                    }, {
                        id: "swell",
                        file: "shts",
                        wd: "_water",
                        h: "wave-swell"
                    },
                    {
                        id: "swell-period",
                        file: "mpts",
                        wd: "_water",
                        h: "wave-swell"
                    }
                ]
            }, {
                id: "snow",
                file: "snih"
            }, {
                id: "freezing",
                file: "nulova_izoterma"
            }
        ],
        Ea = {
            "": {
                kind: "wind",
                yd: 2,
                Bd: "vitr_u_10_m",
                Cd: "vitr_v_10_m"
            },
            "950hpa": {
                kind: "wind",
                yd: 5,
                Bd: "vitr_u_95000_pa",
                Cd: "vitr_v_95000_pa"
            },
            "925hpa": {
                kind: "wind",
                yd: 5,
                Bd: "vitr_u_92500_pa",
                Cd: "vitr_v_92500_pa"
            },
            "900hpa": {
                kind: "wind",
                yd: 5,
                Bd: "vitr_u_90000_pa",
                Cd: "vitr_v_90000_pa"
            },
            "850hpa": {
                kind: "wind",
                yd: 5,
                Bd: "vitr_u_85000_pa",
                Cd: "vitr_v_85000_pa"
            },
            "800hpa": {
                kind: "wind",
                yd: 5,
                Bd: "vitr_u_80000_pa",
                Cd: "vitr_v_80000_pa"
            },
            "750hpa": {
                kind: "wind",
                yd: 5,
                Bd: "vitr_u_75000_pa",
                Cd: "vitr_v_75000_pa"
            },
            "700hpa": {
                kind: "wind",
                yd: 5,
                Bd: "vitr_u_70000_pa",
                Cd: "vitr_v_70000_pa"
            },
            "650hpa": {
                kind: "wind",
                yd: 5,
                Bd: "vitr_u_65000_pa",
                Cd: "vitr_v_65000_pa"
            },
            "600hpa": {
                kind: "wind",
                yd: 5,
                Bd: "vitr_u_60000_pa",
                Cd: "vitr_v_60000_pa"
            },
            "500hpa": {
                kind: "wind",
                yd: 5,
                Bd: "vitr_u_50000_pa",
                Cd: "vitr_v_50000_pa"
            },
            "300hpa": {
                kind: "wind",
                yd: 5,
                Bd: "vitr_u_30000_pa",
                Cd: "vitr_v_30000_pa"
            },
            "200hpa": {
                kind: "wind",
                yd: 5,
                Bd: "vitr_u_20000_pa",
                Cd: "vitr_v_20000_pa"
            },
            "wave-total": {
                kind: "wave",
                Ue: Fa,
                wd: "_water",
                If: [],
                height: "shww",
                direction: "mdww",
                threshold: 1,
                re: {
                    height: "shts",
                    direction: "mdts",
                    If: [1, 2],
                    threshold: 2,
                    kh: !0
                }
            },
            "wave-wind": {
                kind: "wave",
                Ue: Fa,
                wd: "_water",
                If: [],
                height: "shww",
                direction: "mdww",
                threshold: 1
            },
            "wave-swell": {
                kind: "wave",
                Ue: Fa,
                wd: "_water",
                If: [1, 2],
                height: "shts",
                direction: "mdts",
                threshold: 2,
                kh: !0
            }
        },
        ea = {
            length: {
                mm: {
                    Oc: 1,
                    precision: .1,
                    i: [0, 100, 200, 500, 1E3, 2E3, 4E3, 6E3, 8E3, 1E4, 15E3, 2E4, 3E4, 4E4, 5E4]
                },
                inch: {
                    Oc: .0393700787,
                    precision: .01,
                    i: [0, 254, 508, 1016,
                        1524, 2032, 3048, 4064, 5080, 10160, 15240, 20320, 25400, 38100, 50800
                    ]
                }
            },
            blanket: {
                cm: {
                    Oc: 1,
                    precision: 1,
                    i: [0, 1E3, 5E3, 1E4, 15E3, 2E4, 25E3, 3E4, 4E4, 5E4, 6E4, 8E4, 1E5, 15E4, 2E5]
                },
                inch: {
                    Oc: .393700787,
                    precision: .1,
                    i: [0, 1016, 2540, 10160, 15240, 20320, 25400, 30480, 35560, 40640, 50800, 76200, 101600, 152400, 203200]
                }
            },
            height: {
                m: {
                    Oc: 1,
                    precision: .1,
                    i: [0, 500, 1E3, 1500, 2E3, 2500, 3E3, 4E3, 5E3, 6E3, 8E3, 1E4, 12E3, 14E3]
                },
                ft: {
                    Oc: 3.2808399,
                    precision: .1,
                    i: [0, 457, 609, 1219, 1828, 2438, 3048, 3962, 4876, 6096, 7924, 9753, 12192, 14630]
                }
            },
            time: {
                sec: {
                    Oc: 1,
                    precision: 1,
                    i: [0, 2E3, 4E3, 6E3, 8E3, 1E4, 12E3, 14E3, 18E3, 2E4, 22E3]
                }
            },
            altitude: {
                m: {
                    Oc: 1,
                    precision: 100,
                    i: [0, 2E5, 4E5, 6E5, 8E5, 1E6, 12E5, 14E5, 16E5, 18E5, 2E6, 25E5, 3E6, 4E6, 5E6]
                },
                ft: {
                    Oc: 3.2808399,
                    precision: 100,
                    i: [0, 182880, 365760, 548640, 731520, 914400, 1066800, 1219200, 1524E3, 1828800, 2133600, 2438400, 3048E3, 3962400, 4876800]
                }
            },
            temperature: {
                "\u00b0C": {
                    Oc: 1,
                    precision: 1,
                    i: [-4E4, -3E4, -2E4, -15E3, -1E4, -5E3, 0, 5E3, 1E4, 15E3, 2E4, 25E3, 3E4, 4E4, 5E4]
                },
                "\u00b0F": {
                    Xg: function(a) {
                        return 9 * a / 5 + 32
                    },
                    precision: 1,
                    i: [-4E4, -28889, -23333, -17778, -12222, -6667, -1111, 4444, 1E4, 15556, 21111, 26667, 32222, 37778, 48889]
                }
            },
            speed: {
                "km/h": {
                    Oc: 1,
                    precision: 1
                },
                "m/s": {
                    Oc: 1 / 3.6,
                    precision: 1,
                    i: [0, 7200, 14400, 21600, 28800, 36E3, 43200, 50400, 64800, 79200, 93600, 108E3, 122400, 136800, 151200]
                },
                mph: {
                    Oc: .62137119223,
                    precision: 1,
                    i: [0, 8047, 16093, 24140, 32187, 40234, 48280, 56327, 64374, 72420, 80467, 96561, 112654, 128748, 144841]
                },
                kt: {
                    Oc: .539956803,
                    precision: 1,
                    i: [0, 9260, 18520, 27780, 37040, 46300, 55560, 64820, 74080, 83340, 92600, 101860, 111120, 129640, 148160]
                },
                bft: {
                    Xg: function(a) {
                        return k.round(k.min(k.pow(a /
                            3.0096, 2 / 3), 12))
                    },
                    precision: 0,
                    i: [1E3, 5E3, 11E3, 19E3, 28E3, 38E3, 49E3, 61E3, 74E3, 88E3, 102E3, 117E3, 118E3]
                }
            },
            energy: {
                "J/kg": {
                    Oc: 1,
                    precision: 100,
                    i: [0, 2E5, 4E5, 6E5, 8E5, 1E6, 12E5, 14E5, 16E5, 18E5, 2E6, 25E5, 3E6, 4E6, 5E6]
                }
            },
            "energy-inverse": {
                "J/kg": {
                    Oc: 1,
                    precision: 10,
                    i: [0, -2E4, -4E4, -6E4, -8E4, -1E5, -12E4, -14E4, -16E4, -18E4, -2E5, -25E4, -3E5, -4E5, -5E5]
                }
            },
            "energy-derived": {
                "m\u00b2/s\u00b2": {
                    Oc: 1,
                    precision: 10,
                    i: [0, 2E4, 4E4, 6E4, 8E4, 1E5, 12E4, 14E4, 16E4, 18E4, 2E5, 25E4, 3E5, 4E5, 5E5]
                }
            },
            "temperature-index": {
                "\u00b0C": {
                    Oc: 1,
                    precision: 1,
                    i: [-9E3, -8E3, -7E3, -6E3, -5E3, -4E3, -3E3, -2E3, -1E3, 0, 1E3, 2E3, 4E3, 8E3, 12E3]
                }
            },
            percents: {
                "%": {
                    Oc: 1,
                    precision: 10,
                    i: [0, 1E4, 2E4, 3E4, 4E4, 5E4, 6E4, 7E4, 8E4, 9E4, 1E5]
                }
            },
            pressure: {
                hPa: {
                    Oc: 1,
                    precision: 1
                },
                inHg: {
                    Oc: .0295299830714,
                    precision: .1
                },
                mmHg: {
                    Oc: .750061561303,
                    precision: 1
                }
            }
        },
        Wa = {
            metric: {
                length: "mm",
                blanket: "cm",
                altitude: "m",
                temperature: "\u00b0C",
                speed: "km/h",
                pressure: "hPa"
            },
            imperial: {
                length: "inch",
                blanket: "inch",
                altitude: "ft",
                temperature: "\u00b0F",
                speed: "mph",
                pressure: "inHg"
            }
        },
        Xa = pa ? "12px" : "13px",
        u = {
            temperature: {
                min: -36E3,
                max: 5E4,
                step: 500,
                scale: "wq044uwq5p0ywqcohjwqi9dnwqnu9rwqnta7wqnsanwqnrb3wqnqbjwqnpbzwqnocfwqnncvwqnmdbwqni7zwqne2nwqn9q7wqn5kvwqn1fjwqmxa7wqmsxrwqmosfwq78j8wprsa1wpaxgdwovh76woln7vwoaeo3wo0koswnpc50wncpezwn1hgjwmouqiwmc80hwm2e16wlsk1vwlhbazwl7hbowkcl0wwjgacswile20whp36swhw50nwi371mwia8vhwihapcwitzljwj6oovwjjdl2wjw2h9wjxhg6wjywf3wjywmgwk0bldwjyxf7wjxjg5wjuqpiwjtcjcwjp5tnwjkywuwjfdmpwjb6pwwj8f5xwj491iwj1haewixb5zwj05hewj2zsuwj4fjtwj79v8wjbir1wjfrfqwjilr3wjmufswjo9l7wjpoqlwjppbkwjr4gywjobx6wjljdewjhc96wjejpewjsll2wk6ngpwkjaktwkxcggwlbeq6wlqvd7wm4xmxwmizpiwmx1s4wncimawnqkovwo4mrhwofvp8woppvewp0yt5wpaszbwpgeuvwpm0jawpq7uewpvtitwpvsqdwpvrqtwpvqydwpvpytwpvozawpvnzrwpu88owpu795wpu69mwpu5a4wpu43hwpu33ywpu24fwpu14xwpslduwpskebwpsjeswpsifawpshfrwpsgg8wpplxpwpmrf7wpjwpkwph271wpe7oiwpbd60wp8inhwp5o4ywovtdbwoncz0wodi7dwo3n8mwny0yrwntt28wno6sdwnikbewnebmhwna34own5ufrwn1lquxgurf8y0obpuyuhhe8zeb1ouzdzt55zdoklfzdbxa6zd0oqgzcxvlgzcv2ggzcs94bzcqujrzco1erzcl89rzciexmzcflsmzccsnszc9zbvzc7671zc5rfkzc2yaqzc04yszbxbtzzbuii1zbnh9gzbgg0vzb9esazb2djpzatxqozamwi3zafv9iza8u0x",
                opacity: .65
            },
            cape: {
                min: 0,
                max: 5E6,
                step: 1E5,
                scale: "037kp9f2lnd9kci6r5pc3wl4ubefnoub0k3rubait0ubq3dkubudequbhsn6ud0le8uem8naug7vp9uhe1x3uhz2gluhyywluhxg6xuhxc1quhvtc3uhvpe0uhkb4tuh8x2qug6w6euflt96uf4uomwwep8uxg4216xzutdxy9kkldytbby4zd0oqgzcwh0xzcs94azco1eszcjti5zcflsmzcbdwazc75zyzc2yapzbyqedzbuii1zbovtxzbj9cxzbdmotzb807tzb2djpzavcb5zappu5zak361zaegp1za8u0x",
                opacity: .7
            },
            cin: {
                min: -5E5,
                max: 0,
                step: 1E4,
                scale: "za8u0xzaegp1zak361zappu5zavcb5zb2djpzb807tzbdmotzbj9cxzbovtxzbuii1zbyqedzc2yapzc75zyzcbdwazcflsmzcjti5zco1eszcs94azcwh0xzd0oqgytbby4y9kkldxzutdxxg4216wwep8uuf4uomuflt96ug6w6euh8x2quhkb4tuhvpe0uhvtc3uhxc1quhxg6xuhyywluhz2gluhe1x3ug7vp9uem8naud0le8ubhsn6ubudequbq3dkubait0ub0k3rubefnopc3wl4kci6r5f2lnd9037kp9",
                opacity: .7
            },
            li: {
                min: -9E3,
                max: 12E3,
                step: 1E3,
                scale: "za8u0xzbuii1zcflm9zd0oqgzexjkmzfzl2ezhd00tzhoi83zhq52xzhrrclzg0kl9zctaa8zbn2aqzbis9kzb37p0zat8zrzb74jozbpad4zbw9f5zbs0b1zad8j4z9l10k",
                opacity: .6
            },
            helicity: {
                min: 0,
                max: 5E5,
                step: 1E4,
                scale: "037kp9f2lnd9kci6r5pc3wl4ubefnoub0k3rubait0ubq3dkubudequbhsn6ud0le8uem8naug7vp9uhe1x3uhz2gluhyywluhxg6xuhxc1quhvtc3uhvpe0uhkb4tuh8x2qug6w6euflt96uf4uomwwep8uxg4216xzutdxy9kkldytbby4zd0oqgzcwh0xzcs94azco1eszcjti5zcflsmzcbdwazc75zyzc2yapzbyqedzbuii1zbovtxzbj9cxzbdmotzb807tzb2djpzavcb5zappu5zak361zaegp1za8u0x",
                opacity: .7
            },
            wind: {
                min: 0,
                max: 14E4,
                step: 500,
                scale: "f2lnd9fmkuc1g6lfo4gqkmmwhajtlnhukf4vi4k0irioj7hij8iegajsizsdkci6r5l6gz3mmady9en4cqlvo89propc83hxq65h2tra3ut2se0tyvt7zmbbubwlh4ubv7axubsekaubr070ubpm0tubo7umublf3zubk0xsubimkiubfttvubefnoubd1okubbnphuba9qdub8vr9ub7hzaub6406ub4q12ub3c1yub1y2vub0k3rub1z2dub1znnub3em9ub4trzub68qmub694sub7oaiub9394ub93ueubait0ubbxrlubdcq6ubervwubg6uhubj0diubkfc3ubluaoubn9geubooezubq3dkubq3kjubribxubriq0ubriwyubsxodubsxvcubsy2aubsygdubud7rubudequbsz1bubrknwubq6hkubos45ubosb6ubndxrublzkcubkle0ubj70lubhsn6ubnewzubt1dxubynnquc49xkuc9wehuce43uucjqdoucpcnhucuz4fud0le8ud67v3udbubyudhgstudn39oudu4azudzqruue5d8pueazpkuegm6fuem8nauerv45uexhl0uf341vuf8qiquffrk2ufldttufr0aoufwmrjug298eug7vp9ugc3louggbb0ugkj7fugoqwrugsyt6ugx6pluh1eexuh5mbcuh9u0ouhe1x3uhguuvuhi987uhl25yuhmgjauhp9h2uhqnueuhtgs6uhuv5huhxo39uhz2gluhz22duhz1o5uhz1h1uhz12tuhz0oluhz0aduhyzw5uhyzp1uhyzatuhyywluhyyiduhyy46uhyxpyuhyxbruhywxjuhxhrruhxhdkuhxgzcuhxgl5uhxg6xuhxfsquhxfeiuhxf0buhxem3uhxe7wuhxdmkuhxd8duhxcu5uhxcfyuhxc1quhxbnjuhxb9buhxav4uhxagwuhxa2puhvuwxuhvuiquhvu4iuhvtqbuhvtc3uhvsxwuhvsjouhvs5huhvrr9uhvrd2uhvqyuuhvqknuhvq6fuhvps8uhvpe0uhua8auhsv2kuhsuhauhrfbkuhq0czuhol79uhn61juhn5g9uhlqajuhkb4tuhivz3uhhgtduhhgf7uhg19huhem3suhd6y2uhbrscuhbre6uhac8guh8x2quh4oz5uh1vg0ugxnjiugtffxugqlwsugmdt7ugi5pmugdxt4ugb49zug6w6eug5hlxug2oh0ug19peufygkhufx200ufu8v3ufsuamufq0ykufome3uflt96upjzoauzi63dv9exy1v9dizcvjbplkvt9w0ow382frwd4uafwn30piwx174mwwydzpwwwz84wwu638wwsrbnwwpy6qwwn51twwlqa8wwix5cwwhidrwwep8uwwahjgww4v9mww0nk7wvwfutwvs85fwvmlohwvidz3wve69owv8jzuwv4cagwv2xpxwv04kxwuyptawuvwoawuui3rwuroyswuqae8wunh25wum2hlwuj9cmx4hg60xee87uxocf18xy9732xy7sioy84krlyi2rdvyrzjmtz1xq93zbuii1zbovtxzbj9cxzbdmotzb807tzb2djpzavcb5zappu5zak361zaegp1za8u0x",
                opacity: .7
            },
            "rain-1h": {
                min: 0,
                max: 5E4,
                step: 100,
                scale: "037kp9deo32lhulub5km9eifnnwk3iqfk4asr9hk1tsdfzr2t7dfi2u1c9tjuv9pkkuvb4q4uvdyn8uvfdsruvi7pvuvjmvfuvl20zuvnvy3uvpb3muvs50quvtk6auvs5svuvqrfguvpd94uvnyvpuvnz2quvmkpbuvl6bwuvjs5kuvids5uvgzequvs85euw3h37uweptvuwpykkux17icuxcg90uxnozpuxyxqduya6o6uylfeuuyr1vpuywockuz2atfuz7xaauzeybmuzkklduzq728uzvtj3v01fzyv072gtv0bad8v0fi2kv0jpyzv0nxobv0s5kqv0wdh5v10l6hv14t2wv190s8v1d8onv1g187v1hf7bv1k7xyv1llx2v1oegmv1psfqv1skzav1tz5hv1wrp1v1y5o5v1y5h1v1y52uv1y4vqv1y4hiv1y4afv1y43bv1y3p3v1y3hzv1y33sv1y2wov1y2pkv1y2bdv1y249v1y1q1v1y1iyv1wmrev1wmd6v1wm62v1wlrvv1wlkrv1wldnv1wkzgv1wkscv1wke4v1wk71v1wjzxv1wjlpv1wjelv1wj0ev1witav1wim6v1wif2v1wif3v1wi7zv1wi0vv1whtrv1whmnv1whfkv1whfkv1wh8gv1wh1cv1wgu8v1wgn5v1wgn5v1wgg1v1wg8xv1wg1tv1wfuqv1wfnmv1wfnmv1wfgiv1wf9ev1wf2bv1wev7v1wev7v1v03nv1uzwjv1uzpgv1uzicv1uzb8v1uzb8v1uz44v1uyx1v1uypxv1uyitv1uybpv1uybpv1uy4mv1uxxiv1uxqev1uxjav1uxjav1uxc7v1ux53v1uwxzv1uwqvv1uwjrv1uwjsv1uwcov1uw5kv1uvygv1uvyhv1uvrdv1th6yv1tgzuv1tgzvv1tgsrv1tglnv1tglov1s1u4v1s1u5v1s1n1v1s1fxv1s1fyv1s18uv1qmofv1qmhbv1qmhcv1qma8v1qm34v1qm35v1p7blv1p7bmv1p74iv1p74jv1p6xfv1p6qbv1p6qcv1nrysv1nrytv1nrrpv1nrklv1nrkmv1nrdiv1mct3v1mclzv1mcm0v1mcewv1mc7sv1mc7tv1kxg9v1kxgav1kx96v1kx22v1kx23v1kwuzv1jiakv1ji3gv1ji3hv1jhwdv1jhp9v1jhpav1jhi6v1i2xrv1i2qnv1i2qov1i2jkv1i2jkv1i2chv1gnkxv1gnkyv1gnduv1gnduv1gn6rv1gn6rv1f8f8v1f884v1f885v1f811v1f811v1f7tyv1dt9iv1dt2fv1dt2fv1dsvcv1dso8v1dso8v1dsh5v1cdwpv1cdpmv1cdpmv1cdiiv1cdijv1cdbfv1ayjwv1ayjwv1ayctv1ayctv1ay5pv1ay5qv19je6v19j73v19j73v19izzv19j00v19iswv1848hv1841dv1841ev183uav16p9uv16p2qv15ai9v15ai9v13vqpv13vqpv12gz4v12gz4v112eov1127kv0znn3v0znn3v0y8vjv0wub3v0wub2v0vfjiv0vfjiv0u0z2v0u0rxv0sm7hv0sm0dv0r7fxv0r7fwv0psocv0psocv0oe3wv0mzccv0mzcbv0lkrvv0lkkrv0k60bv0k5t6v0ir8qv0ir8qv0hch6v0hch5v0fxwpv0ej55v0ej55v0d4kov0d4dkv0bpt4v0bpt4v0ab1jv0ab1jv08w9zv08w9zv07hpiv07hiev062xyv062xyv04odiv04odhv04odhv04odhv039t1v039t0v039t0v01v8kv01v8kv01v8jv00go3v00ggzv00ggzv00ggyuzz1wiuzz1wiuzz1wiuzxnc1uzxnc1uzxnc1uzw8rluzw8rkuzw8rkuzw8rkuzuu74uzuu74uzuu73uztfmnuztfmnuztfmnuzs126uzs126uzs126uzs126uzqmhpuzqmhpuzqmaluzp7q5uzp7q4uzp7q4uznt5ouznt5ouznt5nuznt5nuzmel7uzmel7uzmel6uzl00quzl00quzjlgav9j6myv9hs2hv9hrvdvjfyopvjfyhlvjejx4vte53svtcqjcvtbbrsw3ax5jw39idzw39idzwd7p7bwd7p06wd6afqwn4h1ywn4h1ywn32adwn32adwx18wlwx18wlwwzu50x6zfisx6y0ycx6wm6sxgw7kkxgusszxgusszxqszf7xqszf7xqrknmy0r61ey0pr9uy0ocpeyanxw1yamjblyamjblykkpxtykkpxsykjb68ykhwlsyuhhsgyug37zyug30vz4e9u7z4e9n3z4cv2mzecg9azeb1ouze9n4eze9n4dze88jxze6tzgze6tzgze5fezze40ujze40uize2ma2ze17pmze17plzdzt55zdyekozdyekozdx007zdvlfrzdvlfrzdu6vazdssauzdssatzdrdqdzdpz5wzdpz5wzdoklfzdoklfzdn5tvzdlr9ezdlr9ezdkcoxzdiy4hzdiy4gzdhjk0zdg4zjzdg4zjzdeqf3zddbumzddbumzdbxa5zdaippzdaipozd9458zd7pkszd7pkrzd6b0bzd4wfuzd4wfuzd3hvdzd23axzd23awzd0oqgzcza60zcza5zzcxvljzcxvljzcwgtzzcv29izcv29izctnp2zctnp1zcs94lzcquk5zcquk4zcpfskzcpfskzco184zcmmnnzcmmnnzcl837zcl836zcjtiqzcier6zcier5zch06pzch06pzcflm9zce71szce71szccshczccshbzcbdprzc9z5bzc9z5azc8kkuzc8kkuzc760ezc5rfxzc5rfxzc4codzc4coczc2y3wzc1jjgzc1jjfzc04yzzc04yzzbyqejzbxbmyzbxbmyzbvx2izbvx2hzbuii1",
                opacity: .8
            },
            "rain-ac": {
                min: 0,
                max: 2E5,
                step: 1E3,
                scale: "037kp9deo32lhulub5qfk4asuv9pkkuvtk6auvqrfguvnyvpuvmkpbuvjs5kuvgzequw3h37uwpykkuxcg90uxyxqduylfeuuywockuz7xaauzkklduzvtj3v072gtv0fi2kv0nxobv0wdh5v14t2wv1d8onv1hf7bv1llx2v1psfqv1tz5hv1y5o5v1y4vqv1y43bv1y33sv1y2bdv1y1iyv1wm62v1wldnv1wke4v1wjlpv1witav1wi0vv1wh8gv1wgg1v1wfnmv1wev7v1uzb8v1uyitv1uxqev1uwxzv1uw5kv1tgzuv1s1u4v1s18uv1qm34v1p74jv1nrytv1mct3v1mc7tv1kx23v1jhwdv1i2qnv1gnkxv1gn6rv1f811v1dsvcv1cdpmv1ayjwv1ay5qv19j00v183uav13vqpv1127kv0wub2v0sm7hv0psocv0lkkrv0hch6v0d4kov0ab1jv062xyv04odhv01v8kv00ggyuzxnc1uzw8rkuztfmnuzs126uzp7q4uznt5nuzl00qvjfyopvtbbrswd7p06wn32adx6y0ycxqszf7y0ocpeykkpxsyug30vzeb1ouze9n4eze9n4dze88jxze6tzgze6tzgze5fezze40ujze40uize2ma2ze17pmze17plzdzt55zdyekozdyekozdx007zdvlfrzdvlfrzdu6vazdssauzdssatzdrdqdzdpz5wzdpz5wzdoklfzdoklfzdn5tvzdlr9ezdlr9ezdkcoxzdiy4hzdiy4gzdhjk0zdg4zjzdg4zjzdeqf3zddbumzddbumzdbxa5zdaippzdaipozd9458zd7pkszd7pkrzd6b0bzd4wfuzd4wfuzd3hvdzd23axzd23awzd0oqgzcza60zcza5zzcxvljzcxvljzcwgtzzcv29izcv29izctnp2zctnp1zcs94lzcquk5zcquk4zcpfskzcpfskzco184zcmmnnzcmmnnzcl837zcl836zcjtiqzcier6zcier5zch06pzch06pzcflm9zce71szce71szccshczccshbzcbdprzc9z5bzc9z5azc8kkuzc8kkuzc760ezc5rfxzc5rfxzc4codzc4coczc2y3wzc1jjgzc1jjfzc04yzzc04yzzbyqejzbxbmyzbxbmyzbvx2izbvx2hzbuii1",
                opacity: .8
            },
            pressure: {
                min: 94E4,
                max: 1054E3,
                step: 300,
                scale: "zhw1ymzhyui8zi08hdzi3183zi5trpzi8mbbzia0agzicsu2ziflkszigzjxzijs3jzijrb3zijqinzijpq7zijoxrzijo5bzijncvzijmkfzijlrzzijkzjzijk73zijgu7zijdhbzija4fzij6rjzij3enzij01rziiwovziitbzziipz3ziimm7yydtkrye7lyuy42eb6xjw6p9wzrdntwfl61wvvgd0gvba5ejv14xqvugyq4yuguifjugqaq4ugm30pughvbaugdnlvug9fwgug5871ug10hmufwss7ufsl2sufodkhufirhpufejzeuf8xwmuf4qebuez44fueuwm4uepajcuel311uefgy9ueb98uue71jfue2tu0udym4ludvsznudrl34udnddpudj5oaudexyvudaq9gucy3ciuclg8huc8tbjubw67iubjjakub6w6iuau99luahm5jua4z8mu9sc4ku9v5npu9xz6uua0sq0ua3m95ua6fzeua99ijuac31ouaewkuuahq3zuakjn4uaq6pfuauf06ub022hub4akcub9xmnubfkhtubjszoubpg1zubtocqubzbf1ubzbm9uc0q6suc0qe0uc0ql7uc25cvuc25czuc25k6uc25reuc3kbxuc3kj5uc3kqauc26cyuc26k3uc0s6suc0sdxubzdthubze0mubxznbubxzufubwlh4ubv7axubsekaubr070ubpm0tubo7umublf3zubk0xsubimkiubfttvubefnoubd1okubbnphuba9qdub8vr9ub7hzaub6406ub4q12ub3c1yub1y2vub0k3rub1z2dub1znnub3em9ub4trzub68qmub694sub7oaiub9394ub93ueubait0ubbxrlubdcq6ubervwubg6uhubj0diubkfc3ubluaoubn9geubooezubq3dkubq3kjubribxubriq0ubriwyubsxodubsxvcubsy2aubsygdubud7rubudequbsz1bubrknwubq6hkubos45ubosb6ubndxrublzkcubkle0ubj70lubhsn6ubnewzubt1dxubynnquc49xkuc9wehuce43uucjqdoucpcnhucuz4fud0le8ud67v3udbubyudhgstudn39oudu4azudzqruue5d8pueazpkuegm6fuem8nauerv45uexhl0uf341vuf8qiquffrk2ufldttufr0aoufwmrjug298eug7vp9ugc3louggbb0ugkj7fugoqwrugsyt6ugx6pluh1eexuh5mbcuh9u0ouhe1x3uhguuvuhi987uhl25yuhmgjauhp9h2uhqnueuhtgs6uhuv5huhxo39uhz2gluhz22duhz1o5uhz1h1uhz12tuhz0oluhz0aduhyzw5uhyzp1uhyzatuhyywluhyyiduhyy46uhyxpyuhyxbruhywxjuhxhrruhxhdkuhxgzcuhxgl5uhxg6xuhxfsquhxfeiuhxf0buhxem3uhxe7wuhxdmkuhxd8duhxcu5uhxcfyuhxc1quhxbnjuhxb9buhxav4uhxagwuhxa2puhvuwxuhvuiquhvu4iuhvtqbuhvtc3uhvsxwuhvsjouhvs5huhvrr9uhvrd2uhvqyuuhvqknuhvq6fuhvps8uhvpe0uhua8auhsv2kuhsuhauhrfbkuhq0czuhol79uhn61juhn5g9uhlqajuhkb4tuhivz3uhhgtduhhgf7uhg19huhem3suhd6y2uhbrscuhbre6uhac8guh8x2quh4oz5uh1vg0ugxnjiugtffxugqlwsugmdt7ugi5pmugdxt4ugb49zug6w6eug5hlxug2oh0ug19peufygkhufx200ufu8v3ufsuamufq0ykufome3uflt96ufkeaiufizbtufg5spufequ0ufdc2gufbx3sufai53uf7olzuf69nauf4uomup1mxhuyztjov8wlskv8v70zvirz9uvsoripw2my4wwcjqdswmhwzzwwep8uwwahjgww4v9mww0nk7wvwfutwvs85fwvmlohwvidz3wve69owv8jzuwv4cagwv2xpxwv04kxwuyptawuvwoawuui3rwuroyswuqae8wunh25wum2hlwuj9cmwuhus8wuf1gawudmvwwuatjywu9ezkwu6lupwu5737wu2dydwu0z6vwty621wtsjdxwtmwwxwtha8twtbnrtwt613pwsyzv5wstde5wsnqq1wsi491wschkx",
                opacity: .7
            },
            clouds: {
                min: 0,
                max: 99E3,
                step: 9900,
                scale: "ixmsick2u8d7ky22n6lt9x49mohrlcntp793oox1q7r6w7i7tys5bzwqo35rzik0zj",
                opacity: .65
            },
            freezing: {
                min: 0,
                max: 6E6,
                step: 1E5,
                scale: "037kp9huhl71nodbchthxtbszb74jozat8zrzb37p0zbis9kzbn2aqzbahj6zctaa8zeexjazg0kl9zh6qt3zhrnslzhq52xzhq0xqzhoi83zhoea0zhd00tzh1lyqzgukc0zgm4bxzgf2p7zg6mp4zfzl2ezfvdd0zfr5ghzfmxr3zfipukzfei56zexmc3zegqj0zdygcmzdhkjjzd0oqgzcwh0xzcs94azco1eszcjti5zcflsmzce788zcbdwazc9zbwzc75zyzc5rfkzc2yapzc1jj7zbyqedzbxbmvzbuii1zbovtxzbj9cxzbdmotzb807tzb2djpzavcb5zappu5zak361zaegp1za8u0x",
                opacity: .6
            },
            snow: {
                min: 0,
                max: 2E5,
                step: 1E3,
                scale: "02ycnsnqxb7atif4knthr5jrth1ryfw8nu7yza833pzaqb3xzb74jozat133zadj22zb1eplzbpad4zbqojazbth9xzbuv8zzbw9f5zbnstozbfc87zb5gv5zax09ozasrrnzaoj9mzalpj6zahh15zad8j4za7lguza1yejz9wb55z9qo2uz9l10kzaab1jzazl2izbov3izce54hzd3f5gzdbukazdk9z4zdrb0lzdzqffze85u9zedrx1zehzfczenli4zert0fzexfabzf1msmzf78vezfbgdpzfh2ghzfl9yszfpho7zftpdmzfxx31zg24sgzg6chvzgak7azgerwpzgizm4zgn7bjzgrf0yzgrgluzgq3tdzgq5e9zgq769zgq8r5zgovrkzgoxjkzgoz4gzgnmbzzgnnwvzgma4uzgkwjxzgjirwzgi4zvzgi5zfzggs7ezgfefdzge0nczgcn2fzgb9aezgconbzgfikpzggxxmzgjrv0zgl77xzgo15bzgpgi8zgsafmzgtpsjzgwjx1zgxz9yzgzemvzh28k9zh3nx6zh6hukzh7x7hzhar4vzhc6hszhf0f6zhgfs3zhgfz7zhgfz7zhgg6bzhhuqszhhuxwzhhuxwzhhv50zhhv50zhhvc4zhj9wlzhja3pzhja3pzhjaatzhjahxzhjahxzhkp9izhkp9izhkpgmzhkpgmzhkpnqzhkpnqzhm4fbzhm4fbzhm4mfzhm4tjzhm4tjzhm50nzhm50nzhnjs8zhnjs8zhnjzczhnjzczhnk6gzhnk6gzhoyy1zhoyy1zhoz55zhozc9zhozc9zhozjdzhqe3uzhqeayzhqeayzhqei2zhqei2zhqep6zhrt9nzhrtgrzhrtgrzhrtnvzhrtnvzht8fgzht8fgzhun71zhun71zhun71zhw1ymzhw1ymzhxgq7zhxgq7zhxgq7zhyvhszhyvhszi0a9dzi0a9dzi0a9dzi1p0yzi1p0yzi33sjzi33sjzi33sjzi4ik4zi4ik4zi5xbpzi5xbpzi5xbpzi7c3azi7c3azi8quvzi8quvzi8quvzia5mgzia5mgzibke1zibke1zibke1zicz5mzicz5mziedx7ziedx7ziedx7zifsoszifsoszih7gdzih7gdzih7gdziim7yziim7yzik0zjzik0zj",
                opacity: .6
            },
            wave: {
                min: 0,
                max: 14E3,
                step: 100,
                scale: "037kp98yuky5huhl71jsg5uhlqeqp1nodbchosaapepw7a2cr04985se0tyvthxtbsulrzy2vpnkxpx3hcxry7cxxezb74jozb4clhzb1kn9zaysw6zaw0xyzat8zrzbfs1lzc3pnuzcq8ikzdcrkdze0p6nzen88hzf9raazfwa50zgk7r9zh6qt3zh84dzzhawjbzhca48zhf29kzhgg1kzhhtmgzhklrszhlzcpzhori1zhq52xzhq3wbzhq2pozhq1byzhq05bzhpyypzhoj7mzhoi10zhogn9zhofgnzhoea0zhljykzhk4eozhha39zhfuc9zhd07xzha5whzh8q5hzh5vu2zh4ga6zh1lyqzgysmpzgvzaozgt5ymzgqcmlzgnjakzgjbe3zggi22zgdoq0zgavdzzg821yzg58pxzg2fdwzfzm1uzfwsptzftzdszfprhbzfmy5azfk4t8zfhbh7zfei56zfaa8ozf62c7zf1u8lzexmc3zetefmzep6j4zekymmzegqj0zecimjze8aq1ze2o93zdygcmzdu890zdq0cizdlsg1zdhkjjzddcn1zd94jfzd4wmyzd0oqgzcza5zzcwgtzzcv29izcs94lzcquk4zco184zcmmnnzcjtiqzcier5zcflm9zce71szcbdprzc9z5azc760ezc5rfxzc2y3wzc1jjfzbyqejzbxbmyzbuii1zbrp5zzbovtxzbm2ozzbj9cxzbgg0vzbdmotzbatcrzb807tzb56vrzb2djpzay5n7zavcb5zasj67zappu5zamwi3zak361zah9tzzaegp1zabnczza8u0x",
                opacity: .6
            },
            "wind-wave": {
                min: 0,
                max: 14E3,
                step: 100,
                scale: "037kp98yuky5huhl71jsg5uhlqeqp1nodbchosaapepw7a2cr04985se0tyvthxtbsulrzy2vpnkxpx3hcxry7cxxezb74jozb4clhzb1kn9zaysw6zaw0xyzat8zrzbfs1lzc3pnuzcq8ikzdcrkdze0p6nzen88hzf9raazfwa50zgk7r9zh6qt3zh84dzzhawjbzhca48zhf29kzhgg1kzhhtmgzhklrszhlzcpzhori1zhq52xzhq3wbzhq2pozhq1byzhq05bzhpyypzhoj7mzhoi10zhogn9zhofgnzhoea0zhljykzhk4eozhha39zhfuc9zhd07xzha5whzh8q5hzh5vu2zh4ga6zh1lyqzgysmpzgvzaozgt5ymzgqcmlzgnjakzgjbe3zggi22zgdoq0zgavdzzg821yzg58pxzg2fdwzfzm1uzfwsptzftzdszfprhbzfmy5azfk4t8zfhbh7zfei56zfaa8ozf62c7zf1u8lzexmc3zetefmzep6j4zekymmzegqj0zecimjze8aq1ze2o93zdygcmzdu890zdq0cizdlsg1zdhkjjzddcn1zd94jfzd4wmyzd0oqgzcza5zzcwgtzzcv29izcs94lzcquk4zco184zcmmnnzcjtiqzcier5zcflm9zce71szcbdprzc9z5azc760ezc5rfxzc2y3wzc1jjfzbyqejzbxbmyzbuii1zbrp5zzbovtxzbm2ozzbj9cxzbgg0vzbdmotzbatcrzb807tzb56vrzb2djpzay5n7zavcb5zasj67zappu5zamwi3zak361zah9tzzaegp1zabnczza8u0x",
                opacity: .6
            },
            swell: {
                min: 0,
                max: 14E3,
                step: 100,
                scale: "037kp98yuky5huhl71jsg5uhlqeqp1nodbchosaapepw7a2cr04985se0tyvthxtbsulrzy2vpnkxpx3hcxry7cxxezb74jozb4clhzb1kn9zaysw6zaw0xyzat8zrzbfs1lzc3pnuzcq8ikzdcrkdze0p6nzen88hzf9raazfwa50zgk7r9zh6qt3zh84dzzhawjbzhca48zhf29kzhgg1kzhhtmgzhklrszhlzcpzhori1zhq52xzhq3wbzhq2pozhq1byzhq05bzhpyypzhoj7mzhoi10zhogn9zhofgnzhoea0zhljykzhk4eozhha39zhfuc9zhd07xzha5whzh8q5hzh5vu2zh4ga6zh1lyqzgysmpzgvzaozgt5ymzgqcmlzgnjakzgjbe3zggi22zgdoq0zgavdzzg821yzg58pxzg2fdwzfzm1uzfwsptzftzdszfprhbzfmy5azfk4t8zfhbh7zfei56zfaa8ozf62c7zf1u8lzexmc3zetefmzep6j4zekymmzegqj0zecimjze8aq1ze2o93zdygcmzdu890zdq0cizdlsg1zdhkjjzddcn1zd94jfzd4wmyzd0oqgzcza5zzcwgtzzcv29izcs94lzcquk4zco184zcmmnnzcjtiqzcier5zcflm9zce71szcbdprzc9z5azc760ezc5rfxzc2y3wzc1jjfzbyqejzbxbmyzbuii1zbrp5zzbovtxzbm2ozzbj9cxzbgg0vzbdmotzbatcrzb807tzb56vrzb2djpzay5n7zavcb5zasj67zappu5zamwi3zak361zah9tzzaegp1zabnczza8u0x",
                opacity: .6
            },
            "wind-wave-period": {
                min: 0,
                max: 2E4,
                step: 1E3,
                scale: "037kp9huhl71thxtbszat8zrzbis9kzbemwdzbahj6ze9bgdzh6qt3zhgg1kzhq52xzhq0xqzhoi83zhir80zhd00tzgoztuzfzl2ezei4wfzd0oqgzcflm9zbuii1",
                opacity: .6
            },
            "swell-period": {
                min: 0,
                max: 2E4,
                step: 1E3,
                scale: "037kp9huhl71thxtbszat8zrzbis9kzbemwdzbahj6ze9bgdzh6qt3zhgg1kzhq52xzhq0xqzhoi83zhir80zhd00tzgoztuzfzl2ezei4wfzd0oqgzcflm9zbuii1",
                opacity: .6
            }
        };
    u["temperature-950hpa"] = u["temperature-925hpa"] = u["temperature-900hpa"] = u["temperature-850hpa"] = u["temperature-800hpa"] =
        u["temperature-750hpa"] = u["temperature-700hpa"] = u["temperature-650hpa"] = u["temperature-600hpa"] = u["temperature-500hpa"] = u["temperature-300hpa"] = u["temperature-200hpa"] = {
            hf: "temperature"
        };
    u["wind-950hpa"] = u["wind-925hpa"] = u["wind-900hpa"] = u["wind-850hpa"] = u["wind-800hpa"] = u["wind-750hpa"] = u["wind-700hpa"] = u["wind-650hpa"] = u["wind-600hpa"] = u["wind-500hpa"] = u["wind-300hpa"] = u["wind-200hpa"] = {
        hf: "wind"
    };
    u.gust = {
        hf: "wind"
    };
    u["rain-3h"] = {
        hf: "rain-1h"
    };
    u.cape.A = function(a) {
        return 100 * a
    };
    u.cape.o = "energy";
    u.cape.Zc = !1;
    u.cin.A = function(a) {
        return -10 * a
    };
    u.cin.o = "energy-inverse";
    u.cin.Zc = !1;
    u.cin.Nh = !0;
    u.li.A = function(a) {
        return a - 128
    };
    u.li.o = "temperature-index";
    u.li.Zc = !1;
    u.li.Nh = !0;
    u.helicity.A = function(a) {
        return 4 * a
    };
    u.helicity.o = "energy-derived";
    u.helicity.Zc = !1;
    u.wave.A = function(a) {
        return a / 10
    };
    u.wave.o = "height";
    u.wave.Zc = !1;
    u.wave.Nd = !0;
    u["wind-wave"].A = function(a) {
        return a / 10
    };
    u["wind-wave"].o = "height";
    u["wind-wave"].Zc = !1;
    u["wind-wave"].Nd = !0;
    u["wind-wave-period"].A = function(a) {
        return a
    };
    u["wind-wave-period"].o =
        "time";
    u["wind-wave-period"].Zc = !1;
    u["wind-wave-period"].Nd = !0;
    u.swell.A = function(a) {
        return a / 10
    };
    u.swell.o = "height";
    u.swell.Zc = !1;
    u.swell.Nd = !0;
    u["swell-period"].A = function(a) {
        return a
    };
    u["swell-period"].o = "time";
    u["swell-period"].Zc = !1;
    u["swell-period"].Nd = !0;
    u.clouds.A = function(a) {
        return k.min(a, 100)
    };
    u.clouds.hk = !0;
    u.clouds.o = "percents";
    u.clouds.Zc = !1;
    u.clouds.ld = "#000";
    u["rain-1h"].A = function(a) {
        a -= 10;
        0 > a && (a = 0);
        return 90 < a ? 80 + 5 * (a - 10 - 80) : 10 > a ? a / 10 : a - 10
    };
    u["rain-3h"].A = u["rain-1h"].A;
    u["rain-ac"].A =
        u["rain-1h"].A;
    u["rain-1h"].o = "length";
    u["rain-3h"].o = "length";
    u["rain-ac"].o = "length";
    u["rain-ac"].Hg = {
        mm: {
            precision: 1,
            i: [0, 1E3, 2E3, 4E3, 6E3, 1E4, 15E3, 2E4, 25E3, 3E4, 4E4, 5E4, 6E4, 7E4, 8E4, 9E4, 1E5, 15E4, 2E5]
        },
        inch: {
            precision: .01,
            i: [0, 1016, 2032, 3048, 5080, 10160, 15240, 20320, 25400, 38100, 50800, 63500, 76200, 88900, 101600, 114300, 127E3, 152400, 203200]
        }
    };
    u["rain-1h"].Zc = !1;
    u["rain-3h"].Zc = !1;
    u["rain-ac"].Zc = !1;
    u.snow.o = "blanket";
    u.snow.A = function(a) {
        0 != a && (a -= 10, 0 > a && (a = 0));
        200 < a ? a = 50 * (a - 200) : 20 < a && (a = 2 * (a - 20));
        return a
    };
    u.snow.Zc = !1;
    u.freezing.A = function(a) {
        return 100 * a
    };
    u.freezing.o = "altitude";
    u.freezing.Zc = !1;
    u.temperature.A = function(a) {
        return a - 128
    };
    u.temperature.o = "temperature";
    u.temperature.Zc = !1;
    u.temperature.Nh = !0;
    u.pressure.A = function(a) {
        return a + 900
    };
    u.pressure.o = "pressure";
    u.pressure.Zc = !1;
    u.wind.A = function(a, b) {
        return 2 * k.sqrt((a - 127) * (a - 127) + (b - 127) * (b - 127))
    };
    u.wind.o = "speed";
    u.wind.Zc = !1;
    u["wind-950hpa"].A = u["wind-925hpa"].A = u["wind-900hpa"].A = u["wind-850hpa"].A = u["wind-800hpa"].A = u["wind-750hpa"].A =
        u["wind-700hpa"].A = u["wind-650hpa"].A = u["wind-600hpa"].A = u["wind-500hpa"].A = u["wind-300hpa"].A = u["wind-200hpa"].A = function(a, b) {
            return 5 * k.sqrt((a - 127) * (a - 127) + (b - 127) * (b - 127))
        };
    u.gust.A = function(a) {
        return 3.6 * a
    };
    u.gust.o = "speed";
    u.gust.Zc = !1;
    var ja = {
            Qh: Infinity,
            nj: -Infinity,
            ai: function(a) {
                var b = 2 < a.zoom ? 5 < a.zoom ? 8 < a.zoom ? 3 : 2 : 1 : 0;
                return "./?p=" + a.lat.toFixed(b) + ";" + a.lon.toFixed(b) + ";" + a.zoom + "&l=" + a.gd + (a.time < ja.Qh || a.time > ja.nj ? "&t=" + a.time.format("yyyyMMdd/HH") : "") + ("auto" != a.od ? "&m=" + a.od : "") +
                    ("normal" != a.zf ? "&w=" + a.zf : "")
            },
            Cj: function(a, b) {
                var c = [];
                U[b].h && c.push("l=" + b);
                "normal" != a && c.push("w=" + a);
                return c.length ? "./?" + c.join("&") : "./"
            },
            parse: function(a) {
                var b = {},
                    c = {
                        p: "",
                        l: ""
                    };
                a.replace(/^[^#?]+/, "").replace(/[?#&]([^=]+)=([^#&]+)/g, function(a, b, y) {
                    c[b] = decodeURIComponent(y)
                });
                a = c.p.replace(/[;,]/g, "/").split("/");
                b.lat = +a[0];
                b.lon = +a[1];
                a[2] && (b.zoom = +a[2]);
                a = c.l.replace(/[;,\/]/g, "-");
                b.gd = a;
                if (a = c.t) b.time = new Date(Date.UTC(+a.slice(0, 4), a.slice(4, 6) - 1, +a.slice(6, 8), +a.slice(9, 11)));
                c.w && (b.zf = c.w);
                c.m && (b.od = c.m);
                return b
            }
        },
        ba = {
            ar: {
                code: "ar",
                label: "Ø¹Ø±Ø¨ÙŠ",
                file: !0
            },
            cs: {
                code: "cs",
                label: "Äesky",
                file: !0
            },
            de: {
                code: "de",
                label: "deutsch",
                file: !0
            },
            en: {
                code: "en",
                label: "english",
                be: "We are sorry, but your browser lacks the support of integral part of this application (HTML <a href=\"https://en.wikipedia.org/wiki/Canvas_element\">element <code>&lt;canvas></code></a>). It's impossible to animate wind without it. If you don't want or can't upgrade your current browser to newer version, you can try different one:",
                P: "Search for locationâ€¦",
                Na: "Searching for â€œ{q}â€â€¦",
                Oa: "Searching for â€œ{q}â€ in OpenStreetMapâ€¦",
                Ka: "Lat.: {lat} / Lon.: {lon} / {place}",
                Ma: "Not found.",
                Vc: "Searching failed, please try again later.",
                Pa: "Type at least {length} characters.",
                La: "Find my position",
                Ja: "My location",
                O: "About",
                Wb: "Help",
                Xb: "Settings",
                B: "Zoom in",
                C: "Zoom out",
                c: {
                    temperature: "Temperature",
                    rain: "Precipitation",
                    clouds: "Clouds",
                    wind: "Wind speed",
                    gust: "Wind gusts",
                    pressure: "Air pressure",
                    snow: "Snow cover",
                    freezing: "Freezing level",
                    wave: "Waves",
                    storm: "Thunderstorms"
                },
                f: {
                    cape: "CAPE",
                    "wind-ground": "10 m above ground",
                    "temperature-ground": "2 m above ground",
                    "850hpa": "850 hPa, 1500 m",
                    "700hpa": "700 hPa, 3000 m",
                    "500hpa": "500 hPa, 5500 m",
                    "300hpa": "300 hPa, 9000 m",
                    "rain-1h": "1 hour",
                    "rain-3h": "3 hours",
                    "rain-ac": "from {time}",
                    "wind-wave": "Wind wave height",
                    swell: "Swell wave height",
                    wave: "Significant wave height",
                    "swell-period": "Swell wave period",
                    "wind-wave-period": "Wind wave period",
                    cin: "CIN",
                    li: "Lifted index",
                    helicity: "Helicity (SRH)",
                    "950hpa": "950 hPa, 500 m",
                    "925hpa": "925 hPa, 750 m",
                    "900hpa": "900 hPa, 1000 m",
                    "800hpa": "800 hPa, 2000 m",
                    "750hpa": "750 hPa, 2500 m",
                    "650hpa": "650 hPa, 3600 m",
                    "600hpa": "600 hPa, 4200 m",
                    "200hpa": "200 hPa, 12000 m"
                },
                M: {
                    soft: "soft",
                    off: "off",
                    normal: "normal",
                    strong: "strong",
                    dark: "dark",
                    fast: "fast-motion"
                },
                Lb: {
                    altitude: "Altitude",
                    accumulation: "Accumulation",
                    storm: "Index",
                    wave: "Type"
                },
                ha: "custom",
                ia: "Wind animation",
                H: "Model",
                G: "Automatic",
                u: "Data: {model}, {source} (resolution {resolution})\nUpdated: {updated} (next update: {next} - prepare)\nCurrent time: {time} ({zone})",
                "$d": {
                    temperature: "For this output data, temperature is shown for {altitude}. The calculations take into account the terrain (elevation), but with lower resolution than in reality. Therefore the models cannot differentiate, for instance, the temperature on a mountain peak or on a city square scorched by the sun. The general rule is that the centres of large cities are 1 Â°C to 3 Â°C warmer than the surrounding area or natural landscapes. Significant temperature differences over a small area are primarily caused in the winter by an inversion. A short yet noticeable cooling can also occur after a local summer storm.",
                    rain: "This output data shows the total precipitation in mm for the previous 1 or 3 hours, or from a specific date (accumulated amount). The models do not differentiate more significant precipitation totals in certain mountainous areas or, on the contrary, faint drizzling from fog and low cloud cover. Forecasting precipitation totals for local storms is difficult. The numerical model does not allow for accurate calculations of the formation of local storm cells. In conversions to snowfall, 1 mm of precipitation equals roughly 1 cm of snowfall.",
                    clouds: "This output data shows cloud cover in percentages. Cloud patterns are very difficult to predict. The calculations also include forecasts for high cloud cover. 100% cloud cover signifies an overcast sky. If, however, the sky is overcast with cloud cover that is thin and the sun is shining through, it is still considered overcast, even though it may seem like a sunny day at first glance.",
                    wind: "The map illustrates the average wind speed at an altitude {altitude}. The calculation does not take into account exposed areas (hilltops, open fields) where wind speed will be greater than that in a city or valley. Localised increases in windiness during storms are also not taken into account in model calculations.",
                    gust: "The map illustrates the maximum wind speed (so-called gusts) at 10 metres above the ground. The calculation does not take into account exposed areas (hilltops, open fields) where wind speed will be greater than that in a city or valley. Localised increases in windiness during storms are also not taken into account in model calculations.",
                    pressure: "Calculations illustrate air pressure values at sea level. The output data differentiates between pressure highs and lows as well as pressure gradients, which influence wind speed.",
                    cape: "When there is possibility of storm formation, it is recommended to monitor the values of the CAPE (this map shows surface based CAPE). It represents potential energy in the atmosphere. It helps to establish the level of atmospheric instability. The greater the values reached, the greater the likelihood of the formation of a storm. Values less than 300 are low, between 300 to 1000 are weak, 1000 to 2000 are moderate, and over 2000 are high, when the possibility of the occurrence of strong storms is highly likely. Storm formation is influenced by a number of other factors, however, CAPE is an important indicator.",
                    snow: "This data illustrates the anticipated height of snow cover. Prediction of snow cover development is very complex, and the values listed may differ from actual values reached (even by several centimetres). The calculations take into account the terrain (elevation), but with lower resolution than in reality. Therefore, the model cannot display the exact snow cover height in mountainous areas, where it differs greatly.",
                    freezing: "The altitude in metres at which the temperature dips below the freezing point is illustrated on the map. This altitude has a large influence on the state of precipitation. At altitudes above this level, precipitation generally occurs in solid states (snowflakes, ice crystals). At lower altitudes, on the contrary, precipitation occurs in a liquid state. This does not, however, always have to be the case. In some instances, snowfall may occur at lower altitudes as well. This is due to the fact that snow does not melt immediately at temperatures above the freezing point, but melts gradually. Therefore, primarily in low humidity, it can snow up to 400 m below this altitude. During temperature inversions, freezing precipitation may fall at this altitude.",
                    wave: "The application displays two types of waves: swells and wind waves. Waves travelling outside of their place of origin, and are thus not caused by local winds, are called swells.  Waves caused by winds in that specific location are called wind waves. In the application, wind waves are marked in white and swells are marked in black. This feature allows you to quickly find areas where high wind waves are travelling in a different direction from the swells. Significant wave height is the average height (trough to crest) of the one-third highest waves. Given the variability of wave height, the largest individual waves are likely to be somewhat less than twice the reported significant wave height for a particular day. Wave period is time interval between arrival of consecutive crests at a stationary point.",
                    li: "The lifted index (LI) is the temperature difference between an air parcel when it reaches the 500 hPa level and the actual temperature of the environmental air at 500 hPa. When the value is positive, the atmosphere is stable and when the value is negative, the atmosphere is unstable. Lifted Index maps are used to forecast the likelihood of thunderstorms. Values below 0 indicating instability and an increasing chance of thunderstorms. Lifted Index is generally scaled as follows: 6 or greater: very stable conditions (without thunderstorms), between 1 and 6: stable conditions, (thunderstorms not likely), between 0 and -2: slightly unstable (thunderstorms possible), between -2 and -6 : unstable (thunderstorms likely), less than -6:  very unstable (severe thunderstorms likely).",
                    cin: "Convective inhibition (CIN) is a measure that indicates the amount of the energy that needs to be overcome in order for convection (thunderstorms) to occur. This map shows surface based CIN. CIN can be weakened by daytime heating, frontal lifting or other lifting mechanisms. CIN is generally scaled as follows: 0 to -50: weak inhibition, -50 to -200: moderate inhibition, less than -200: strong inhibition.",
                    helicity: "SRH (Storm Relative Helicity) is a measure of the potential for cyclonic updraft rotation in right-moving supercells, and is calculated for the 3-km layers above ground level. Larger values (greater than 250 m<sup>2</sup>/s<sup>2</sup>) suggest an increased threat of tornadoes with supercells."
                },
                da: "Play",
                ea: "Pause",
                Qb: "Previous",
                Pb: "Next",
                Ob: "Change date",
                Rb: "Today",
                Gc: "Show present-day forecast",
                b: "Settings",
                Ta: "You can change the setting for the whole application or for the meteorological data here.",
                Ua: "Language",
                Wa: "Resolution",
                Ya: "Reduced",
                Xa: "Native",
                Za: "Restore default",
                T: "Application settings",
                Va: "You can change the setting for the whole application here.",
                U: "Animation settings",
                cb: "You can change the setting for the streamlines which show average wind speed and wind direction. High values may overload your browser if your computer is less powerful.",
                rb: "Predefined settings",
                sb: "Number of streamlines",
                ub: "Few",
                tb: "Many",
                hb: "Motion speed",
                jb: "Low",
                ib: "High",
                vb: "Average thickness of the streamlines",
                xb: "Thin",
                wb: "Wide",
                yb: "Streamline thickness variation",
                Ab: "Same thickness",
                zb: "Various thickness",
                kb: "Lifetime",
                mb: "Ephemeral",
                lb: "Persistent",
                ob: "Transparency",
                qb: "Opaque",
                pb: "Transparent",
                eb: "Streamlines length",
                gb: "Short",
                fb: "Long",
                ab: "Color",
                bb: ["White", "Black", "Light", "Dark"],
                Qa: "Border color",
                Ra: ["Automatic", "Black", "White"],
                R: "Weather map settings",
                Sa: "You can change the setting for the weather map which shows selected meteorological variables.",
                S: "Show values in grid",
                "$a": {
                    length: "Precipitation units",
                    blanket: "Snow units",
                    altitude: "Altitude units",
                    temperature: "Temperature units",
                    speed: "Speed units",
                    pressure: "Pressure units"
                },
                rc: "Weather map opacity",
                We: "Weather map interpolation",
                sf: "Font size",
                uf: "Small",
                tf: "Large",
                Uc: "Performance meter, optimum is 60 frames per second",
                V: "Share",
                "$": "Share options",
                sc: "Thank you for spreading word about our website. Pick what you want to share please:",
                I: "Weather Forecast Maps",
                Dc: "Hyperlink",
                Ac: "Screenshot",
                Fc: "Live screenshot",
                tc: "Embed",
                Cb: "Animated GIF image",
                ad: "Video",
                Ec: "share on",
                Z: "Link to",
                X: "position",
                Ib: "active layer",
                Y: "date and time",
                Kb: "animation settings",
                Jb: "scale",
                Fb: "Image format",
                Db: "Cut",
                Eb: "Cut part of screen",
                Gb: "aspect ratio",
                Hb: "free",
                Cc: "golden",
                Bc: "Include information in the corner",
                Ic: "upload to",
                Ie: "There will be link to Ventusky, linking specifically to current",
                vc: "Dimensions",
                wc: "Target time",
                xc: "current",
                yc: "tomorrow",
                zc: "nearest weekend",
                uc: "Lock",
                "$c": "Number of animation frames",
                Yc: "Animation speed",
                Xe: "Video duration",
                Ye: "Create loop",
                De: "You can create clean screenshot here, without user interface.",
                Ee: "You are allowed to use this image wherever you want. We would appreciate if you put active hyperlink to Ventusky nearby.",
                Fe: "Live screenshot is a fragment of HTML code for your web page, which can show the same animation you see here.",
                Ge: "Generated code works independently, all needed data are <a href=\"https://en.wikipedia.org/wiki/Data_URI_scheme\" target=\"_blank\">inside</a> of it, nothing is downloaded from Ventusky (or from anywhere else), it's permanent imprint of selected state, similar to classic screenshot, but with animation algorithm inside. It's automatically adjustible to various widths, so you don't have to worry about mobile layout.",
                He: "If you can't paste this code anywhere in your content management system or animation does not work afterwards, please contact your website administrator, we can't fix it.",
                Jh: "There will be a way to embed live Ventusky website into your web page. But it isn't ready yet, stay tuned.",
                Kh: "We don't recommend using animated GIFs in web environment, because their file size is huge. But here you can create infinite animation loop from current state (without anoying rewind stutter).",
                Lh: "For creating videofile inside your browser, we have to download huge <a href=\"https://en.wikipedia.org/wiki/FFmpeg\" target=\"_blank\">FFmpeg library</a> (18 MB) inside this page. If you think you and your browser can handle it, we can give it a tryâ€¦",
                W: "Create",
                Bb: "Cancel",
                K: "on",
                J: "off",
                Jc: "not available",
                Hc: "demo",
                Ke: "Under constructionâ€¦",
                Yb: "New!",
                coords: "{lat} {lon}",
                we: "{deg}Â°{sign}",
                Yg: "{deg}Â°{min}'{sign}",
                Ea: "E",
                Da: "W",
                Ca: "N",
                Ba: "S",
                ua: "north",
                va: "northeast",
                ta: "east",
                ya: "southeast",
                xa: "south",
                za: "southwest",
                Aa: "west",
                wa: "northwest",
                qa: "night",
                ma: "astronomical twilight",
                pa: "nautic twilight",
                na: "civil twilight",
                oa: "day",
                la: "high noon",
                ra: "rise",
                sa: "set",
                Nb: "hr.",
                ba: "min.",
                ca: "to",
                s: "yyyy/MM/dd",
                Fa: "MM/dd",
                Ga: "ddd|[MMM dd]",
                v: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                F: 1,
                D: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                Ha: [],
                Vb: "Current days",
                sd: "HH:mm",
                vf: "HH:mm",
                wf: "HH[:mm]",
                L: !0,
                Tb: "Change units to â€œ{unit}â€",
                Ia: ".",
                oc: "Wind shear",
                Ub: "Wind waves",
                Mb: "Swell",
                pc: "Swell wave direction",
                qc: "Wind wave direction",
                Zb: "Low clouds",
                "$b": "Middle clouds",
                ac: "High clouds",
                bc: "Total cloud cover",
                fa: "Waves animation",
                cc: "Show isobar",
                dc: "Show time zones",
                ec: "Basemap",
                fc: "Show extreme values",
                gc: "Convective precipitation",
                hc: "rain showers, snow showers, thunderstorms",
                ic: "Freezing rain",
                jc: "Hail",
                kc: "Snow",
                lc: "Global models",
                mc: "Regional models",
                nc: "Detailed weather forecast on",
                kj: {
                    altitude: "{group}, {sublayer}",
                    accumulation: "{group} {sublayer}",
                    storm: "{sublayer}"
                },
                zd: "Show lat, lon grid",
                Vd: {}
            },
            "en-ca": {
                code: "en-ca",
                label: "english (CA)",
                F: 0,
                L: !0
            },
            "en-us": {
                code: "en-us",
                label: "english (US)",
                v: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                F: 0,
                sd: "hh:mm tt",
                vf: "hh:mm|[tt]",
                wf: "hh [tt]",
                bl: "AM",
                cl: "PM",
                L: !1
            },
            fr: {
                code: "fr",
                label: "franÃ§ais",
                file: !0
            },
            "fr-ca": {
                code: "fr-ca",
                label: "franÃ§ais (CA)",
                file: !0
            },
            hu: {
                code: "hu",
                label: "magyarul",
                file: !0
            },
            it: {
                code: "it",
                label: "italiano",
                file: !0
            },
            ja: {
                code: "ja",
                label: "æ—¥æœ¬èªž",
                file: !0
            },
            ko: {
                code: "ko",
                label: "í•œêµ­ì–´",
                file: !0
            },
            nl: {
                code: "nl",
                label: "nederlands",
                file: !0
            },
            pl: {
                code: "pl",
                label: "polski",
                file: !0
            },
            pt: {
                code: "pt",
                label: "portuguÃªs",
                file: !0
            },
            "pt-br": {
                code: "pt-br",
                label: "portuguÃªs (BR)",
                file: !0
            },
            ru: {
                code: "ru",
                label: "Ñ€ÑƒÑÑÐºÐ¸Ð¹",
                file: !0
            },
            sk: {
                code: "sk",
                label: "slovensky",
                file: !0
            },
            uk: {
                code: "uk",
                label: "ÑƒÐºÑ€Ð°Ñ—Ð½ÑÑŒÐºÐ¾ÑŽ",
                file: !0
            },
            vi: {
                code: "vi",
                label: "TiÃªÌng ViÃªÌ£t",
                file: !0
            },
            zh: {
                code: "zh",
                label: "ç®€ä½“",
                file: !0
            },
            "zh-tw": {
                code: "zh-tw",
                label: "ç¹é«”",
                file: !0
            },
            es: {
                code: "es",
                label: "espaÃ±ol",
                file: !0
            },
            ro: {
                code: "ro",
                label: "romÃ¢nÄƒ",
                file: !0
            },
            tr: {
                code: "tr",
                label: "tÃ¼rkÃ§e",
                file: !0
            },
            sv: {
                code: "sv",
                label: "svenska",
                file: !0
            },
            nb: {
                code: "nb",
                label: "norsk",
                file: !0
            },
            lv: {
                code: "lv",
                label: "latvieÅ¡u",
                file: !0
            },
            lt: {
                code: "lt",
                label: "lietuviÅ³",
                file: !0
            },
            hr: {
                code: "hr",
                label: "hrvatski",
                file: !0
            },
            fi: {
                code: "fi",
                label: "suomi",
                file: !0
            },
            et: {
                code: "et",
                label: "estonian",
                file: !0
            },
            el: {
                code: "el",
                label: "ÎµÎ»Î»Î·Î½Î¹ÎºÎ¬",
                file: !0
            },
            bg: {
                code: "bg",
                label: "Ð±ÑŠÐ»Ð³Ð°Ñ€ÑÐºÐ¸",
                file: !0
            }
        },
        d = {
            zi: function(a, b, c) {
                for (var f = a.length, v = [], y = 0; y < a.length; y++)(function(h) {
                    d.yi(a[h], function(a) {
                        v[h] = a;
                        f--;
                        f || b(v)
                    }, c)
                })(y)
            },
            yi: function(a, b, c) {
                var f = new Image;
                f.onload = function() {
                    this.onload = null;
                    var a = d.al;
                    a.width = this.width;
                    a.height = this.height;
                    var f = a.getContext("2d");
                    c ? (f.drawImage(this, -this.width / 2, 0), f.drawImage(this, this.width / 2, 0)) : f.drawImage(this, 0, 0);
                    try {
                        var v = f.getImageData(0, 0, a.width, a.height).data
                    } catch (k) {
                        v = []
                    }
                    a = new Uint8Array(v.length / 4);
                    for (f = 0; f <
                        v.length; f += 4) a[f / 4] = v[f + 1];
                    b(a)
                };
                if ("crossOrigin" in f) f.crossOrigin = "Anonymous", f.src = a;
                else if (A.URL) {
                    var v = new XMLHttpRequest;
                    v.onload = function() {
                        var a = URL.createObjectURL(this.response),
                            b = f.onload;
                        f.onload = function() {
                            b.apply(this, arguments);
                            URL.revokeObjectURL(a)
                        };
                        f.src = a
                    };
                    v.open("GET", a, !0);
                    v.responseType = "blob";
                    v.send()
                } else f.src = a
            },
            se: function(a, b) {
                var c = A.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
                try {
                    c.open("GET", a, !0)
                } catch (f) {
                    b("");
                    return
                }
                c.onreadystatechange =
                    function() {
                        4 == c.readyState && b(c.responseText)
                    };
                c.onerror = function() {
                    b("")
                };
                try {
                    c.send("")
                } catch (f) {
                    b("")
                }
            }
        };
    d.setTransform = function(a) {
        if ("undefined" == typeof a.transform || "undefined" != typeof a.OTransform) {
            var b = "undefined" == typeof a.OTransform ? "undefined" == typeof a.WebkitTransform ? "undefined" == typeof a.MozTransform ? "undefined" == typeof a.msTransform ? null : "msTransform" : "MozTransform" : "WebkitTransform" : "OTransform";
            return function(a, f) {
                a.style[b] = f
            }
        }
        return function(a, b) {
            a.style.transform = b + " translate3d(0, 0, 0)"
        }
    }(B.documentElement.style);
    d.Ih = function(a) {
        var b = "undefined" == typeof a.transformOrigin ? "undefined" == typeof a.OTransformOrigin ? "undefined" == typeof a.WebkitTransformOrigin ? "undefined" == typeof a.MozTransformOrigin ? "undefined" == typeof a.msTransformOrigin ? null : "msTransformOrigin" : "MozTransformOrigin" : "WebkitTransformOrigin" : "OTransformOrigin" : "transformOrigin";
        return function(a, f) {
            a.style[b] = f
        }
    }(B.documentElement.style);
    d.ij = function(a) {
        var b = "undefined" == typeof a.transition ? "undefined" == typeof a.Af ? "undefined" == typeof a.WebkitTransition ?
            "undefined" == typeof a.MozTransition ? null : "MozTransition" : "WebkitTransition" : "OTransition" : "transition";
        return function(a, f) {
            a.style[b] = f
        }
    }(B.documentElement.style);
    d.a = function(a, b) {
        var c = B.createElement(a || "div");
        if (b)
            for (var f in b)
                if ("parent" == f) b[f].appendChild(c);
                else if ("style" == f) c.style.cssText = b[f];
        else if ("children" == f)
            for (var v = 0; v < b[f].length; v++) c.appendChild("object" != typeof b[f][v] ? B.createTextNode(b[f][v]) : b[f][v]);
        else try {
            c[f] = b[f]
        } catch (y) {}
        return c
    };
    d.Qc = function(a) {
        return B.getElementById(a)
    };
    d.al = d.a("canvas");
    (function(a, b, c) {
        a.Ad || (a.Ad = function(a, b) {
            return this.length < a ? Array(a - this.length + 1).join(b ? String(b).charAt(0) : " ") + this : String(this)
        });
        a.Af || (a.Af = function(a, b) {
            return this.length < a ? this + Array(a - this.length + 1).join(b ? String(b).charAt(0) : " ") : String(this)
        });
        c.format = function(a) {
            var b = this;
            return a.replace(/(\\?)(d+|M+|y+|H+|h+|m+|s+|t+)/g, function(a, c, f) {
                c && (c = a.slice(0, 2), f = a.slice(2));
                var d = f.length;
                switch (f.charAt(0)) {
                    case "d":
                        f = 2 >= d ? b.getUTCDate().toString().Ad(d, "0") : 3 ==
                            d ? (n.cd || [])[b.getUTCDay()] || n.v[b.getUTCDay()].slice(0, 2) : n.v[b.getUTCDay()];
                        break;
                    case "M":
                        a = b.getUTCMonth();
                        f = 2 >= d ? (a + 1).toString().Ad(d, "0") : 3 == d ? n.Ha[a] || n.D[a].slice(0, 3) : n.D[a];
                        break;
                    case "y":
                        a = b.getUTCFullYear(d);
                        2 >= d && (a %= 100);
                        f = a.toString().Ad(d, "0");
                        break;
                    case "H":
                        f = b.getUTCHours().toString().Ad(d, "0");
                        break;
                    case "h":
                        f = (b.getUTCHours() % 12 || 12).toString().Ad(d, "0");
                        break;
                    case "t":
                        f = (12 > b.getUTCHours() ? n.bl : n.cl).slice(0, d);
                        break;
                    case "m":
                        f = b.getUTCMinutes().toString().Ad(d, "0");
                        break;
                    case "s":
                        f =
                            b.getUTCSeconds().toString().Ad(d, "0")
                }
                return c + f
            }).replace(/\\(.)/g, "$1")
        }
    })(String.prototype, Array.prototype, Date.prototype, Number.prototype);
    d.Pc = function(a, b) {
        var c;
        a = (a || "").replace(/\{([^\}\:]+)(?:\:([^\}]+))?\}/g, function(a, f, h) {
            return f in b ? Array.isArray(b[f]) ? (c || (c = {}), c[f] = b[f], a) : b[f].format && h ? b[f].format(h) : b[f] : ""
        });
        if (!c) return a;
        var f = [a],
            v;
        for (v in c) {
            for (var y = [], h = 0; h < c[v].length; h++)
                for (var d = 0; d < f.length; d++) y.push(f[d].replace(new RegExp("{" + v + "}", "g"), c[v][h]));
            f = y
        }
        return f
    };
    d.ig = function(a) {
        return String(a).charAt(0).toUpperCase() + String(a).slice(1)
    };
    d.Ti = function(a, b) {
        return String(k.round(a * b) / b).replace(/\-/, "\u2212").replace(/\./, n.Ia)
    };
    d.coords = function(a, b) {
        return d.Pc(n.coords, {
            lat: d.oi(a.lat, b),
            lon: d.pi(a.lon, b)
        })
    };
    d.we = function(a, b, c) {
        return c ? d.Pc(n.Yg, {
            deg: k.floor(a),
            min: (k.round(a % 1 * 60) + "").Ad(2, "0"),
            sign: b
        }) : d.Pc(n.we, {
            deg: k.round(a),
            sign: b
        })
    };
    d.oi = function(a, b) {
        return 0 > a ? d.we(-a, n.Ba, b) : d.we(a, n.Ca, b)
    };
    d.pi = function(a, b) {
        return 0 > a ? d.we(-a, n.Da, b) : d.we(a,
            n.Ea, b)
    };
    d.timeZone = function(a, b) {
        var c = "UTC" + (a ? (0 > a ? "+" : "-") + (new Date(k.abs(6E4 * a))).format("HH:mm") : "");
        return n.Vd[c + (b ? "d" : "s")] || n.Vd[c] || c.replace(/-/, "\u2212")
    };
    d.Wf = function(a, b) {
        a = a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        b && (a = a.replace(/"/g, "&quot;"));
        return a.replace(/[\u0080-\uFFFF]/g, function(a) {
            return "&#" + a.charCodeAt(0) + ";"
        })
    };
    A.Uint8Array && A.Int32Array && A.Float64Array || (A.Uint8Array = A.Int32Array = A.Float64Array = Array);
    k.sign || (k.sign = function(a) {
        return a ?
            0 > a ? -1 : 1 : a
    });
    (function(a) {
        d.gl = function() {
            return d.oj(B.documentElement, "q", void 0)
        };
        a.classList ? (d.Aj = function(b) {
            a.classList.add(b)
        }, d.Rk = function(b) {
            a.classList.remove(b)
        }, d.Kg = function(a, c) {
            a.classList.add(c)
        }, d.xh = function(a, c) {
            a.classList.remove(c)
        }, d.oj = function(a, c, f) {
            var v = a.classList.contains(c);
            v ? !0 !== f && a.classList.remove(c) : !1 !== f && a.classList.add(c);
            return !!f === f ? f : !v
        }) : (d.Aj = function(a) {
            d.Kg(B.documentElement, a)
        }, d.Rk = function(a) {
            d.xh(B.documentElement, a)
        }, d.Kg = function(a, c) {
            a.className +=
                " " + c
        }, d.xh = function(a, c) {
            a.className = a.className.replace(new RegExp("^|\\s" + c + "(?=\\s|$)", "g"), "")
        }, d.oj = function(a, c, f) {
            var v = -1 < a.className.split(" ").indexOf(c);
            v ? !0 !== f && d.xh(a, c) : !1 !== f && d.Kg(a, c);
            return !!f === f ? f : !v
        })
    })(B.documentElement);
    d.ng = function(a) {
        // return (B.cookie.match(new RegExp(a + "=([^;]+)")) || [])[1]
    };
    d.Qe = function(a) {
        try {
            var b = localStorage.getItem(a)
        } catch (c) {
            return d.ng(a)
        }!b && (b = d.ng(a)) && (d.Ae(a, b), d.yh(a));
        return b
    };
    d.Fh = function(a, b) {
        // B.cookie = a + "=" + b + "; expires=" + (new Date(2035,
        //     0, 1)).toGMTString() + "; path=/"
        // B.cookie = '';
        // console.log(B.cookie, a, b);
    };
    d.Ae = function(a, b) {
        try {
            localStorage.setItem(a, b), d.yh(a)
        } catch (c) {
            d.Fh(a, b)
        }
    };
    d.yh = function(a) {
        // B.cookie = a + "=; expires=" + (new Date(1970, 0, 1)).toGMTString() + "; path=/"
    };
    d.Qk = function() {
        try {
            localStorage.removeItem("dpr")
        } catch (a) {}
        d.yh("dpr")
    };
    (function() {
        for (var a = 0, b = ["webkit", "moz"], c = 0; c < b.length && !A.requestAnimationFrame; ++c) A.requestAnimationFrame = A[b[c] + "RequestAnimationFrame"], A.cancelAnimationFrame = A[b[c] + "CancelAnimationFrame"] || A[b[c] + "CancelRequestAnimationFrame"];
        A.requestAnimationFrame || (A.requestAnimationFrame = function(b) {
            var c = (new Date).getTime(),
                y = k.max(0, 16 - (c - a)),
                h = A.setTimeout(function() {
                    b(c + y)
                }, y);
            a = c + y;
            return h
        }, A.requestAnimationFrame.Cl = !0);
        A.cancelAnimationFrame || (A.cancelAnimationFrame = function(a) {
            clearTimeout(a)
        })
    })();
    d.Bi = function(a) {
        var b = ba.en,
            c;
        for (c in b)
            if (!(c in ba[a])) ba[a][c] = b[c];
            else if ("object" == typeof b[c])
            for (var f in b[c]) f in ba[a][c] || (ba[a][c][f] = b[c][f])
    };
    var n = function() {
        for (var a in ba) "en" != a && d.Bi(a);
        a = d.ng("lang") || I.lang;
        "zh-cn" == a && (a = "zh");
        "pt-BR" == a && (a = "pt-br");
        return ba[a] || ba.en
    }();
    "HTMLCanvasElement" in A ? /ve(\/)?nt(\\)?us(\/)?ky\.com$|^localhost$/.test(location.hostname) ? function(a) {
        a && a.parentNode.removeChild(a)
    }(d.Qc("no-js")) : A.open(qa, "_top") : (B.body.className = "d", d.a("p", {
        innerHTML: n.be,
        parent: B.body
    }), d.a("ul", {
        innerHTML: '\r\n      <li><a href="https://vivaldi.com/">Vivaldi</a>\r\n      <li><a href="https://www.palemoon.org/">Pale Moon</a>\r\n      <li><a href="https://www.opera.com/">Opera</a>\r\n    ',
        parent: B.body
    }));
    var r = {};
    r.form = d.Qc("header");
    r.input = r.form.q;
    r.ed = r.form.getElementsByTagName("ul")[0];
    r.ze = r.ed.getElementsByTagName("li")[0];
    r.Tc = function() {
        r.form.querySelector("h1 a").onclick = function() {};
        r.form.onsubmit = function() {
            clearTimeout(b);
            r.send(!0);
            return !1
        };
        r.input.autocomplete = "off";
        var a = !0;
        r.input.id = r.input.parentNode.htmlFor = "search-q";
        r.input.onfocus = function() {
            r.form.className = "p";
            clearTimeout(r.Ef);
            r.show();
            this.value == this.defaultValue && (this.className = this.value = "");
            if (a) r.input.oninput();
            a = !1
        };
        r.input.onkeydown = function(a) {
            if (38 == a.keyCode || 40 == a.keyCode) {
                var b = r.Nc.length + 1;
                r.Nc.active && (r.ed.getElementsByTagName("a")[r.Nc.active - 1].className = "");
                r.Nc.active = (r.Nc.active + a.keyCode - 39 + b) % b;
                r.Nc.active && (r.ed.getElementsByTagName("a")[r.Nc.active - 1].className = "r");
                return !1
            }
        };
        r.ed.className = "l";
        r.ed.onmouseout = function() {
            r.Nc.active && (r.ed.getElementsByTagName("a")[r.Nc.active - 1].className = "");
            r.Nc.active = 0
        };
        r.input.onblur = function() {
            r.form.className = "";
            clearTimeout(b);
            "" == this.value.trim() &&
                (this.value = this.defaultValue, this.className = "h");
            clearTimeout(r.Ef);
            r.Ef = setTimeout(r.ef, 200)
        };
        var b;
        r.input.oninput = function() {
            clearTimeout(b);
            !this.value.trim() && 0 < r.Xd.length ? (r.Nc = r.Xd, r.Nc.active = 0, r.Mh()) : 2 > this.value.trim().length ? (r.ed.insertBefore(r.ze, r.ed.firstChild), r.ze.textContent = d.Pc(n.Pa, {
                length: 2
            })) : (this.value.trim() != r.Nc.value && r.ed.insertBefore(r.ze, r.ed.firstChild), r.ze.textContent = d.Pc(n.Na, {
                q: this.value
            }), b = setTimeout(function() {
                r.send()
            }, 400))
        };
        try {
            r.Xd = JSON.parse(localStorage.getItem("search") ||
                "[]")
        } catch (c) {}
    };
    r.ef = function() {
        r.ed.className = "l"
    };
    r.show = function() {
        r.ed.className = ""
    };
    r.Nc = [];
    r.Xd = [];
    r.Vk = function() {
        try {
            localStorage.setItem("search", JSON.stringify(r.Xd))
        } catch (a) {}
    };
    r.zj = function(a) {
        for (var b = 0; b < r.Xd.length; b++)
            if (r.Xd[b].lat == a.lat && r.Xd[b].lon == a.lon) return;
        r.Xd.unshift(a);
        5 < r.Xd.length && (r.Xd.length = 5);
        r.Vk()
    };
    r.Mh = function() {
        for (; r.ed.firstChild;) r.ed.removeChild(r.ed.firstChild);
        if (r.Nc.length)
            for (var a = 0; a < r.Nc.length; a++)(function(a, c) {
                a = r.Nc[c];
                var f = d.a("li");
                r.ed.appendChild(f);
                var v = d.a("a");
                v.href = "?lat=" + a.lat + "&lon=" + a.lon;
                v.onclick = function() {
                    r.ef();
                    z.hj(+a.lat, +a.lon, y.textContent);
                    l.nf(+a.lat, +a.lon, +a.zoom || 5);
                    r.zj(a);
                    l.log("location", "search-result");
                    return !1
                };
                v.onmouseover = function() {
                    r.Nc.active && (r.ed.getElementsByTagName("a")[r.Nc.active - 1].className = "");
                    r.Nc.active = c + 1;
                    v.className = "r"
                };
                v.onfocus = function() {
                    clearTimeout(r.Ef)
                };
                v.onblur = function() {
                    clearTimeout(r.Ef);
                    r.Ef = setTimeout(r.ef, 200)
                };
                f.appendChild(v);
                var f = d.a("h3"),
                    y = d.a("b"),
                    h = a.address[a.type] || a.address.city ||
                    a.address.suburb || a.address.county || a.address.state;
                y.textContent = h || a.address.country || "?";
                h && (f.textContent = a.address.country ? ", " + a.address.country : " ");
                v.appendChild(f);
                f.insertBefore(y, f.firstChild);
                f = d.a("span");
                v.appendChild(f);
                f.textContent = d.Pc(n.Ka, {
                    lat: d.oi(a.lat, !0),
                    lon: d.pi(a.lon, !0),
                    place: a.address.state || a.address.country || "N/A"
                })
            })(r.Nc[a], a);
        else r.ed.appendChild(r.ze), r.ze.textContent = n.Ma
    };
    r.send = function(a) {
        function b(f, v) {
            clearTimeout(r.Ui);
            if (c == r.input.value.trim()) {
                try {
                    var y =
                        JSON.parse(f || "[]")
                } catch (h) {
                    r.ze.textContent = d.Pc(n.Vc, {
                        q: c
                    });
                    return
                }
                r.Nc = y;
                r.Nc.value = c;
                r.Nc.active = 0;
                r.Nc.length || v ? r.Mh() : r.Ui = setTimeout(function() {
                    r.ze.textContent = d.Pc(n.Oa, {
                        q: c
                    });
                    l.log("searching-osm", c);
                    d.se(d.Pc("https://nominatim.openstreetmap.org/search?q={q}&format=json&polygon=0&addressdetails=1&limit=5&accept-language={lang}", {
                        q: encodeURIComponent(c),
                        lang: encodeURIComponent(n.code)
                    }), function(a) {
                        b(a, !0)
                    })
                }, a ? 20 : 750)
            }
        }
        var c = r.input.value.trim();
        2 > c.length || ("ventusky" == c.toLowerCase() ?
            (t.Yh = !0, z.close(), r.input.value = "") : (clearTimeout(r.Ui), l.log("searching", c), d.se(d.Pc("ventusky_mesta.php?q={q}&lang={lang}", {
                q: encodeURIComponent(c),
                lang: encodeURIComponent(n.code)
            }), function(a) {
                b(a, !1)
            })))
    };
    r.jk = function() {
        var a = this;
        a.className = "z r";
        l.log("location", "geolocate");
        navigator.geolocation.getCurrentPosition(function(b) {
            a.className = "z";
            z.hj(b.coords.latitude, b.coords.longitude, n.Ja);
            l.nf(b.coords.latitude, b.coords.longitude, 7)
        }, function() {
            a.className = "z"
        })
    };
    navigator.geolocation &&
        (r.geolocation = d.a("a", {
            className: "z",
            onclick: r.jk,
            parent: r.form
        }));
    r.Re = function() {
        r.input.value == r.input.defaultValue && (r.input.value = n.P, r.input.className = "h");
        r.input.defaultValue = n.P;
        r.geolocation && (r.geolocation.title = n.La);
        r.Mh()
    };
    r.Tc();
    var g = {};
    g.Sb = (new Date(I.now)).getTimezoneOffset();
    g.Eg = -k.ceil(g.Sb / 60);
    g.fl = fa(-g.Sb, 60);
    g.mj = (new Date((new Date(I.now)).getFullYear(), 0, 1)).getTimezoneOffset() != g.Sb;
    ja.Qh = (new Date(I.now)).setUTCHours(0, g.Sb, 0, 0);
    ja.nj = (new Date(I.now)).setUTCHours(24,
        g.Sb, 0, -1);
    g.Tc = function() {
        g.Wj();
        g.Zj();
        g.Yj();
        var a = [];
        a.push(["auto", {
            toString: function() {
                return n.G
            }
        }]);
        for (var b = 0; b < X.length; b++) a.push([X[b], X[b].toUpperCase()]);
        g.fg({
            className: "x",
            label: {
                toString: function() {
                    return n.H
                }
            },
            parent: B.body,
            id: "model",
            options: a,
            ge: function(a) {
                l.Ug(a)
            },
            value: I.model
        });
        a = [];
        for (b = 0; b < ia.length; b++) a.push([ia[b], {
            value: ia[b],
            toString: function() {
                return n.M[this.value] || this.value
            }
        }]);
        a.push(["", {
            toString: function() {
                return n.ha
            }
        }]);
        g.fg({
            className: "b",
            label: {
                toString: function() {
                    return "wave" ==
                        Ea[e.h].kind ? n.fa : n.ia
                }
            },
            select: !0,
            parent: B.body,
            id: "wind-type",
            options: a,
            ge: function(a) {
                a ? l.vd(a) : (C.Hf && l.vd(C.Hf), C.vd || C.Se())
            },
            value: "normal"
        });
        for (var c in ea) {
            var a = [],
                b = 0,
                f;
            for (f in ea[c]) a.push([f, f]), b++;
            if (!(2 > b))
                for (b = 0; b < a.length; b++) ea[c][a[b][0]].rh = a[(b + 1) % a.length][0]
        }
        B.addEventListener("keydown", function(a) {
            if ((("INPUT" != a.target.tagName || "text" != a.target.type) && "TEXTAREA" != a.target.tagName && "SELECT" != a.target.tagName || a.target.readOnly) && g.Zd[a.keyCode]) return g.Zd[a.keyCode](), !1
        }, !1);
        g.B = d.a("a", {
            className: "g s",
            parent: B.body
        });
        g.C = d.a("a", {
            className: "g c",
            parent: B.body
        });
        d.a("a", {
            id: "i",
            onclick: function() {
                g.u.className = g.u.className ? "" : "l"
            },
            parent: B.body
        });
        g.u = d.a(0, {
            id: "v",
            className: "l",
            children: [d.a(0), d.a("a", {
                className: "u",
                onclick: function() {
                    g.u.className = "l"
                }
            })],
            parent: B.body
        });
        g.Zd[77] = function() {
            for (var a = [], b = 0; b < X.length; b++) {
                var c = D[X[b]];
                c.Dd[+l.j] && c.Dd[+l.j][l.g] && a.push(X[b])
            }
            a = a[(a.indexOf(l.Ed()) + 1) % a.length];
            b = a.toUpperCase();
            D.auto.Xc[+l.j][l.g] == a &&
                (b = n.G + " (" + b + ")", a = "auto");
            l.Ug(a);
            g.Wc.model.Od(a);
            g.Je(n.H, b)
        };
        g.Zd[80] = function() {
            var a = d.gl();
            g.Je(n.Hl || "Presentation mode", a ? n.K : n.J)
        };
        z.Tc()
    };
    g.Zj = function() {
        var a = d.a(0, {
            id: "m",
            parent: B.body
        });
        g.Lc = {};
        g.Lc.ka = a;
        g.Lc.play = d.a("a", {
            className: "t w",
            children: ["", d.a("span")],
            onclick: function() {
                g.Uf ? g.stop(!0) : g.play()
            },
            parent: a
        });
        g.Lc.Xi = d.a("a", {
            className: "t e",
            onclick: function() {
                g.stop();
                var a = D[l.Kc].c[l.g];
                (a = a[a.indexOf(+l.j) - 1]) && l.ve(a)
            },
            children: ["", d.a("span")],
            parent: a
        });
        g.Lc.next =
            d.a("a", {
                className: "t j",
                onclick: function() {
                    g.stop();
                    var a = D[l.Kc].c[l.g];
                    (a = a[a.indexOf(+l.j) + 1]) && l.ve(a)
                },
                children: ["", d.a("span")],
                parent: a
            });
        g.Zd[37] = function() {
            g.Lc.Xi.onclick();
            g.Je((new Date(l.j - 6E4 * g.Sb)).format(n.sd) + " \u2039\u2013")
        };
        g.Zd[39] = function() {
            g.Lc.next.onclick();
            g.Je("\u2013\u203a " + (new Date(l.j - 6E4 * g.Sb)).format(n.sd))
        };
        g.Lc.day = d.a("a", {
            className: "t f",
            children: ["", d.a("span")],
            onclick: function() {
                g.stop();
                g.ue.className = g.ue.className ? "" : "l"
            },
            parent: a
        });
        g.Lc.now = d.a("a", {
            className: "t y",
            style: "display: none",
            children: [""],
            onclick: function() {
                g.stop();
                l.ve(new Date(I.now))
            },
            parent: a
        });
        var b = d.a("span", {
            className: "o",
            onclick: function(a) {
                g.stop();
                var b = this.getBoundingClientRect();
                a = k.min(k.max((a.clientX - b.left) / (b.right - b.left), 0), 1);
                a = k.min(k.max(a, 0), 1);
                l.ve(864E5 * k.floor((l.j - 6E4 * g.Sb) / 864E5) + 19872E5 * a / 24 + 6E4 * g.Sb)
            },
            parent: a
        });
        Ba(b, function(a) {
            function c(a) {
                var f = b.getBoundingClientRect();
                a = k.min(k.max((a.clientX - f.left) / (f.right - f.left), 0), 1);
                a = new Date(864E5 * k.floor((l.j - 6E4 *
                    g.Sb) / 864E5) + 19872E5 * a / 24 + 6E4 * g.Sb);
                f = a.getUTCHours();
                g.Lc.hour.style.left = (4.34 * fa(f + a.getUTCMinutes() / 60 + g.Eg, 24)).toFixed(3) + "%";
                a.setUTCHours(f + g.Eg, 30 > a.getUTCMinutes() ? 0 : 60);
                g.Lc.hour.setAttribute("time", a.format(n.sd))
            }
            g.Lc.hour.className = "a n";
            c(a);
            return {
                qf: c,
                rf: function(a) {
                    b.onclick(a)
                }
            }
        });
        for (var c = [], f = 0; 24 > f; f++) {
            var v = fa(f + g.Eg, 24);
            c[v] = d.a("a", {
                innerHTML: String(v).Ad(2, "0"),
                style: "left: " + (4.34 * v).toFixed(3) + "%",
                className: "dv " + (f % 3 ? "my" : "cj") + " " + (f % 6 ? "ha" : "lp") + " " + (f % 12 ? "bx" : "rw"),
                parent: b
            })
        }
        g.il = function() {
            for (var a = (new Date(l.j - 6E4 * g.Sb)).setUTCHours(0, g.Sb + g.fl, 0, 0), b = 0; 24 > b; b++) {
                var f = a + 36E5 * b,
                    v = new Date(f - 6E4 * g.Sb);
                c[b].innerHTML = g.Rd(v.format(n.vf));
                c[b].style.display = D[l.Kc].Xc[f] && D[l.Kc].Xc[f][l.g] ? "" : "none";
                c[b].title = v.format(n.s + " " + n.sd)
            }
        };
        g.Lc.hour = d.a("span", {
            className: "a",
            parent: b
        });
        g.ue = d.a(0, {
            id: "k",
            className: "l",
            parent: a
        });
        g.si({
            id: "date",
            className: "bm",
            ge: function(a) {
                g.stop();
                a = new Date(+a + 6E4 * g.Sb);
                a.setUTCMilliseconds((l.j - 6E4 * g.Sb) % 864E5);
                l.ve(a)
            },
            parent: a
        });
        g.si({
            id: "hour",
            className: "ks",
            ge: function(a) {
                l.ve(a)
            },
            parent: a
        })
    };
    g.Rd = function(a) {
        return a.replace(/\[([^\]]+)\]/g, "<small>$1</small>").replace(/\|/g, "<br>")
    };
    g.Me = {};
    g.Nj = function() {
        var a = D[l.Kc].c[l.g],
            b = new Date(a[0] - 6E4 * g.Sb);
        b.setUTCHours(0, 0, 0, 0);
        for (var c = new Date(a[a.length - 1] - 6E4 * g.Sb), f = (new Date(new Date - 6E4 * g.Sb)).setUTCHours(0, 0, 0, 0), v = [], d = -1, b = +b; b <= +c; b += 864E5) {
            var h = new Date(b),
                k = "";
            d != h.getUTCMonth() && (-1 < d && (k = "ls"), d = h.getUTCMonth()); + h == f && (k += " rg");
            v.push([b, h.format(n.Ga),
                k
            ])
        }
        g.af.date.dj(v);
        c = [];
        f = -1;
        for (b = 0; b < a.length; b++) h = new Date(a[b] - 6E4 * g.Sb), k = "", f != h.getUTCDate() && (-1 < f && (k = "ls"), f = h.getUTCDate()), c.push([a[b], h.format(n.wf), k]);
        g.af.hour.dj(c)
    };
    g.Qg = function() {
        var a = D[l.Kc].c[l.g],
            b = new Date(k.max(a[0], Va) - 6E4 * g.Sb);
        b.setUTCHours(0, 0, 0, 0);
        var a = new Date(a[a.length - 1] - 6E4 * g.Sb),
            c = n.F;
        for (g.Nj(); g.ue.firstChild;) g.ue.removeChild(g.ue.firstChild);
        d.a("a", {
            className: "u",
            onclick: function() {
                g.ue.className = "l"
            },
            parent: g.ue
        });
        for (var f = d.a("table", {
                    parent: g.ue
                }),
                v = f.insertRow(-1), y = 0; 7 > y; y++) d.a("th", {
            textContent: (n.cd || [])[(y + c) % 7] || n.v[(y + c) % 7].slice(0, 2),
            parent: v
        });
        y = new Date(+b);
        y.setUTCDate(y.getUTCDate() - 7 - (y.getUTCDay() - c + 7) % 7);
        var h = (new Date(new Date - 6E4 * g.Sb)).setUTCHours(0, 0, 0, 0),
            M = new Date(+a);
        M.setUTCHours(0, 0, 0, 0);
        for (M.setUTCDate(M.getUTCDate() + 14 - (M.getUTCDay() - c + 7) % 7); y < M;) {
            y.getUTCDay() == c && (v = f.insertRow(-1));
            G || (v.className = "ls qw");
            var e = d.a("td", {
                    parent: v
                }),
                G = String(y.getUTCDate()).Ad(2, "0"),
                G;
            y >= b && y <= a ? (G = d.a("a", {
                textContent: G,
                parent: e,
                onclick: function(a) {
                    return function() {
                        g.stop();
                        var b = new Date(+a + 6E4 * g.Sb);
                        b.setUTCMilliseconds((l.j - 6E4 * g.Sb) % 864E5);
                        l.ve(b);
                        return !1
                    }
                }(new Date(y))
            }), g.Me[y.format("yyyyMMdd")] = G) : G = d.a("span", {
                textContent: G,
                parent: e
            }); + y == h && (e.className = "rg");
            var La = y.getUTCMonth();
            y.setUTCHours(24);
            La != y.getUTCMonth() && (e.className += " bj", v.className += " bj", d.a("i", {
                textContent: n.D[La],
                parent: v.cells[0]
            }))
        }
        v.className += " ls nk"
    };
    g.pd = function() {
        var a = new Date(new Date - 6E4 * g.Sb),
            b = new Date(l.j - 6E4 * g.Sb);
        g.Lc.hour.setAttribute("time",
            b.format(n.sd));
        a = a.setUTCHours(0, 0, 0, 0) == b.setUTCHours(0, 0, 0, 0);
        g.Lc.day.childNodes[1].textContent = a ? n.Rb + ", " + b.format(n.s) : b.format("dddd, " + n.s);
        g.fk();
        a = l.j.getUTCHours();
        g.Lc.hour.className = "a dv " + (a % 3 ? "my" : "cj") + " " + (a % 6 ? "ha" : "lp") + " " + (a % 12 ? "bx" : "rw");
        g.Lc.hour.style.left = (4.34 * fa(a + g.Eg, 24)).toFixed(3) + "%";
        g.Me.selected && (g.Me.selected.className = "");
        g.Me.selected = g.Me[b.format("yyyyMMdd")];
        g.Me.selected && (g.Me.selected.className = "qj");
        g.af.date.Od(864E5 * k.floor(b / 864E5));
        g.af.hour.Od(+l.j);
        g.il();
        g.Lc.now.style.display = +l.j < ja.Qh ? "" : "none";
        var b = l.Ed(),
            a = D[b].Kd[l.g].oe || D[b].oe,
            c = D[b].Kd[l.g].ne || D[b].ne,
            b = {
                model: b.toUpperCase(),
                resolution: (D[b].Kd[l.g].size || D[b].size).Cg,
                updated: (new Date(+a)).format(n.sd),
                next: (new Date(+a + 36E5 * c)).format(n.sd),
                time: (new Date(l.j - 6E4 * g.Sb)).format(n.sd + ", " + n.s),
                altitude: "",
                zone: d.timeZone(g.Sb, g.mj),
                source: '<a href="' + D[b].Oh + '" target="_blank">' + D[b].source + "</a>"
            },
            a = U[l.g].description;
        U[l.g].pg && (b.sublayer = b.accumulation = b.altitude = g.gh(l.g));
        g.u.firstChild.innerHTML = "<p>" + d.Pc(n.u + "\n\n" + n.$d[a], b).replace(/\n\n+/g, "<p>").replace(/\n/g, "<br>")
    };
    g.Wc = {};
    g.Mj = function(a, b) {
        return d.a("select", {
            onchange: function() {
                b(this.value)
            },
            onkeyup: function() {
                this.onchange()
            },
            onfocus: function() {
                B.documentElement.onmouseenter = function() {
                    B.documentElement.className = ""
                };
                B.documentElement.onmouseleave = function() {
                    B.documentElement.className = "hv"
                }
            },
            onblur: function() {
                B.documentElement.onmouseenter = B.documentElement.onmouseleave = null;
                B.documentElement.className =
                    ""
            },
            parent: a
        })
    };
    g.fg = function(a) {
        var b = "bb " + a.className + (a.select ? " xx" : ""),
            c = d.a(0, {
                className: b,
                parent: a.parent
            });
        if (a.label) var f = d.a(0, {
            className: "yn",
            innerHTML: a.label + ":",
            parent: c
        });
        for (var v = d.a(0, {
                className: "dm",
                parent: c
            }), y, h = {}, k = 0; k < a.options.length; k++) {
            var l = a.options[k][0],
                G = d.a("a", {
                    textContent: d.ig(a.options[k][1]),
                    value: l,
                    onclick: function(b) {
                        if (e && b || "disabled" == this.getAttribute("disabled")) return !1;
                        g.stop();
                        y && (y.className = "");
                        y = this;
                        y.className = "qj";
                        a.ge(this.value)
                    },
                    parent: v
                });
            h[l] = G;
            a.value == l && (y = G, y.className = "qj")
        }
        if (a.select) {
            var e = g.Mj(v, function(a) {
                h[a].onclick.call(h[a])
            });
            e.optionsMap = {};
            for (k = 0; k < a.options.length; k++) e.optionsMap[a.options[k][0]] = d.a("option", {
                value: a.options[k][0],
                textContent: d.ig(a.options[k][1]),
                style: a.options[k][2] ? "font-weight: bold" : "",
                parent: e
            });
            e.value = a.value
        }
        a.id && (g.Wc[a.id] = {
            Od: function(a) {
                h[a] && (y && (y.className = ""), e && (e.value = a), y = h[a], y.className = "qj")
            },
            ef: function() {
                c.style.display = "none"
            },
            show: function() {
                c.style.display = ""
            },
            refresh: function() {
                for (var b = 0; b < a.options.length; b++) h[a.options[b][0]].textContent = d.ig(a.options[b][1]);
                a.label && (f.innerHTML = a.label + ":");
                if (e)
                    for (b = 0; b < a.options.length; b++) e.optionsMap[a.options[b][0]].textContent = d.ig(a.options[b][1])
            },
            move: function(a) {
                a.appendChild(c)
            },
            Dg: function(a) {
                c.className = b + " " + a
            },
            ka: c,
            options: h,
            select: e
        }, null === a.value && (c.style.display = "none"))
    };
    g.Yj = function() {
        g.Hk = d.a("span", {
            className: "tz",
            children: [d.a("span", {
                className: "jh"
            }), d.a("span", {
                className: "ua"
            }), d.a("span", {
                className: "xz"
            })],
            parent: B.body
        })
    };
    g.Th = function() {
        g.Hk.style.display = e.tg || q.tg ? "block" : ""
    };
    g.Wj = function() {
        for (var a = d.a(0, {
                id: "d",
                parent: B.body
            }), b = {}, c = {}, f = [], v = [], k = 0; k < aa.length; k++)(function(h) {
            function k() {
                l.Ff(y) && g.stop();
                return !1
            }
            var y = h.id;
            h.f && (k = function() {
                g.stop();
                if (U[l.g].pg == h.kind && l.Ff(h.f[U[l.g].qk].id) || h.zg && l.Ff(h.zg)) return !1;
                for (var a = 0; a < h.f.length; a++)
                    if (l.Ff(h.f[a].id)) return !1
            });
            b[y] = d.a("a", {
                onclick: k,
                children: ["", d.a("span", {
                    className: y
                })],
                parent: a
            });
            v.push([y, {
                label: y,
                toString: function() {
                    return n.c[this.label] || "[" + this.label + "]"
                }
            }]);
            c[y] = d.a(0, {
                parent: a
            });
            if (h.f) {
                f.push(y);
                for (var e = [], m = 0; m < h.f.length; m++) e.push([h.f[m].id, {
                    id: h.f[m].id,
                    toString: function() {
                        return g.gh(this.id)
                    }
                }, h.f[m].Jd]);
                g.fg({
                    className: "nx",
                    label: {
                        label: h.kind,
                        toString: function() {
                            return n.Lb[this.label] || "[" + this.label + "]"
                        }
                    },
                    select: !0,
                    parent: c[y],
                    id: "sublayer-" + y,
                    options: e,
                    ge: function(a) {
                        g.stop();
                        l.Ff(a)
                    }
                })
            }
        })(aa[k]);
        var h = b[l.g];
        h.className = "qj";
        g.fg({
            className: "xn",
            select: !0,
            parent: a,
            id: "layers",
            options: v,
            ge: function(a) {
                return b[a].onclick()
            },
            value: U[l.g].group
        });
        g.c = {
            translate: function() {
                for (var a = 0; a < aa.length; a++) b[aa[a].id].firstChild.data = n.c[aa[a].id] || "[" + aa[a].id + "]"
            },
            update: function() {
                for (var a = D[l.Kc], c = a.Dd[+l.j], v = U[l.g].group, d = 0; d < aa.length; d++) {
                    var k = !1,
                        y = aa[d].id;
                    if (aa[d].f)
                        for (var e = 0; e < aa[d].f.length && !k; e++) a.c[aa[d].f[e].id] && c[aa[d].f[e].id] && (k = !0);
                    else k = a.c[y] && c[y];
                    k ? b[y].removeAttribute("disabled") : b[y].setAttribute("disabled", "disabled")
                }
                for (d = 0; d < f.length; d++)
                    if (y =
                        g.Wc["sublayer-" + f[d]], f[d] == v)
                        for (y.show(), y.Od(l.g), a = y.select, e = 0; e < za.length; e++) za[e].group == v && (y = za[e].id, !D[l.Kc].c[y] || c && !c[y] ? a.optionsMap[y].parentNode && a.removeChild(a.optionsMap[y]) : a.appendChild(a.optionsMap[y]));
                    else y.ef();
                h.className = "";
                h = b[v];
                h.className = "qj";
                g.Wc.layers.Od(v);
                for (d = X.length - 1; 0 <= d; d--) c = D[X[d]], c.Dd[+l.j] && c.Dd[+l.j][l.g] ? g.Wc.model.options[X[d]].removeAttribute("disabled") : g.Wc.model.options[X[d]].setAttribute("disabled", "disabled")
            }
        }
    };
    g.gh = function(a) {
        if (!U[a].Ah) return n.f[U[a].label] ||
            "[" + U[a].label + "]";
        var b = D[l.Ed()];
        return d.Pc(n.f[U[a].label], {
            time: (new Date((b.Kd[a].start || b.start) - 6E4 * g.Sb)).format(n.Fa + " " + n.sd)
        })
    };
    g.ah = {};
    g.fk = function() {
        var a = g.Lc.day.childNodes[1],
            b = a.firstChild.data;
        if (b in g.ah) a.style.letterSpacing = g.ah[b];
        else {
            a.style.letterSpacing = "";
            var c = a.offsetWidth - 12 - a.offsetHeight;
            a.style.width = 0;
            var f = a.scrollWidth;
            a.style.width = "";
            var v = b.length;
            g.ah[b] = c < f ? a.style.letterSpacing = ((c - f) / v).toFixed(3) + "px" : ""
        }
    };
    g.Re = function() {
        g.c.translate();
        g.Lc.play.firstChild.data =
            g.Uf ? n.ea : n.da;
        g.Lc.Xi.firstChild.data = n.Qb;
        g.Lc.next.firstChild.data = n.Pb;
        g.Lc.day.firstChild.data = n.Ob;
        g.Lc.now.firstChild.data = n.Gc;
        g.Qg();
        g.B.title = n.B;
        g.C.title = n.C;
        var a = Wa[n.L ? "metric" : "imperial"],
            b;
        for (b in a) l.Vg(b, a[b]), q.N && q.N.o == b && g.Wc[b] && g.Wc[b].Od(a[b]);
        d.Qc("menu-about").firstChild.data = n.O;
        g.pd();
        for (b in g.Wc) g.Wc[b].refresh()
    };
    g.translate = function(a) {
        ba[a].file ? d.se("app/lang-" + a + ".js", function(b) {
            ba[a] = eval("(" + b + ")");
            d.Bi(a);
            g.translate(a)
        }) : n = ba[a];
        r.Re();
        g.Re();
        C.Re();
        t.Re()
    };
    g.play = function() {
        function a() {
            function f() {
                g.Uf && (l.ve(h), g.Wi = setTimeout(a, 200))
            }
            var v, d, h = b[++c];
            if (!h) return g.stop();
            q.wh(h, function() {
                v = !0;
                d && f()
            });
            g.Wi = setTimeout(function() {
                d = !0;
                v && f()
            }, 800)
        }
        g.Uf = !0;
        g.Lc.play.className = "t ll";
        g.Lc.play.firstChild.data = n.ea;
        var b = D[l.Kc].c[l.g],
            c = b.indexOf(+l.j);
        a();
        l.log("animation", "play")
    };
    g.stop = function(a) {
        g.Uf && (g.Uf = !1, g.Lc.play.className = "t w", g.Lc.play.firstChild.data = n.da, clearTimeout(g.Wi), l.log("animation", a ? "manual-stop" : "auto-stop"))
    };
    g.Zd = {};
    g.Je = function(a, b) {
        var c = b ? a + ": <b>" + b + "</b>" : a;
        g.sg ? g.sg.innerHTML = c : g.sg = d.a(0, {
            className: "zg",
            innerHTML: c,
            parent: B.body
        });
        clearTimeout(g.zk);
        g.zk = setTimeout(function() {
            B.body.removeChild(g.sg);
            delete g.sg
        }, 1750)
    };
    g.af = {};
    g.Md = k.ceil(A.innerWidth / 100 * 16);
    A.addEventListener("resize", function() {
        g.Md = k.ceil(A.innerWidth / 100 * 16);
        for (var a in g.af) g.af[a].resize()
    }, !1);
    g.si = function(a) {
        function b() {
            var a = g.Md,
                b = a / A.innerWidth,
                b = k.atan(b) / k.PI * 2 / b * b * k.PI,
                c = a / 2 / k.tan(b / 2),
                f = h.scrollLeft;
            d.setTransform(y,
                "translateX(" + -h.scrollLeft + "px)");
            var v = k.round(-k.PI / 2 / b + f / a);
            if (v != r) {
                for (var l = 0; 10 > l; l++) {
                    var e = W[l + v] && G[W[l + v]] || {
                        Di: "&nbsp;",
                        className: ""
                    };
                    n[l].innerHTML = e.Di;
                    n[l].className = e.className
                }
                r = v
            }
            for (l = 0; 10 > l; l++) {
                var M = (l + v) * a,
                    e = (M - f) * b / a;
                if (e < -k.PI / 2 || e > k.PI / 2) e = k.PI / 2;
                var m = n[l];
                d.setTransform(m, "translateX(" + (-(l * a - (f + k.sin(e) * c))).toFixed(3) + "px) rotateY(" + e.toFixed(3) + "rad)");
                (M = k.abs(M - f) < a / 2) && (p = W[l + v]);
                m.style.background = M ? "rgba(247, 167, 21, " + k.cos(10 * e).toFixed(3) + ")" : "rgba(0, 0, 0, " +
                    (1 - k.cos(e)).toFixed(3) + ")";
                m.style.color = M ? "" : "rgba(255, 255, 255, " + k.cos(e).toFixed(3) + ")"
            }
        }

        function c(a) {
            var b = h.onscroll;
            h.onscroll = null;
            h.scrollLeft = a;
            h.onscroll = b
        }

        function f() {
            if (!ka && !O && (e.paused = !1, p != t)) {
                var c = W.indexOf(p);
                if (-1 < c) {
                    var f = c * g.Md - h.scrollLeft,
                        v = h.scrollLeft,
                        d = 500 * k.abs(c - h.scrollLeft / g.Md),
                        y = Date.now();
                    e.paused = !0;
                    var l = h.onscroll;
                    h.onscroll = null;
                    var M = setInterval(function() {
                        var c = (Date.now() - y) / d;
                        1 < c && (c = 1, clearInterval(M), e.paused = !1, h.onscroll = l, a.ge(p));
                        h.scrollLeft =
                            v + f * c;
                        b()
                    }, 13);
                    t = p
                }
            }
        }
        for (var v = d.a(0, {
                className: "ja " + (a.className || ""),
                parent: a.parent
            }), y = d.a("ul", {
                parent: v
            }), h = d.a(0, {
                className: "jz",
                parent: v
            }), l = d.a(0, {
                parent: h
            }), W = [], G = {}, n = [], m = 0; 10 > m; m++) n.push(d.a("li", {
            innerHTML: "&nbsp;",
            style: "width: " + g.Md + "px",
            parent: y
        }));
        var q, x = 0,
            ka = !1,
            O = !1;
        h.ontouchstart = function(a) {
            x++;
            ka = !0;
            e.paused = !0;
            a.stopPropagation()
        };
        h.ontouchend = function() {
            x--;
            x || (ka = !1, f());
            clearInterval(w)
        };
        var w;
        h.ontouchcancel = function() {
            clearInterval(w);
            w = setInterval(function() {
                var a =
                    h.scrollLeft;
                c(a ? a - 1 : a + 1);
                h.scrollLeft != a && (clearInterval(w), ka = !1, f());
                c(a)
            }, 200)
        };
        var p, t;
        h.onscroll = function() {
            e.paused = !0;
            b();
            clearTimeout(q);
            O = !0;
            q = setTimeout(function() {
                O = !1;
                f()
            }, 500)
        };
        h.onclick = function(a) {
            var b = W.indexOf(p);
            a.clientX > A.innerWidth / 2 ? b++ : b--;
            W[b] && (p = W[b], f())
        };
        var r;
        g.af[a.id] = {
            dj: function(a) {
                W.length = 0;
                G = {};
                for (var f = 0, h = 0; h < a.length; h++) G[a[h][0]] = {
                    Di: g.Rd(a[h][1]),
                    className: a[h][2]
                }, W.push(a[h][0]), a[h][0] == p && (f = h);
                l.style.width = W.length * g.Md + (A.innerWidth - g.Md) + "px";
                c(f *
                    g.Md);
                b()
            },
            Od: function(a) {
                var f = W.indexOf(a); - 1 < f && (p = a, c(f * g.Md), b())
            },
            resize: function() {
                if (v.offsetWidth) {
                    for (var a = 0; 10 > a; a++) n[a].style.width = g.Md + "px";
                    l.style.width = W.length * g.Md + (A.innerWidth - g.Md) + "px";
                    this.Od(p)
                }
            }
        }
    };
    var C = {
        Tc: function() {
            var a = B.getElementsByTagName("menu")[0];
            C.link = d.a("a", {
                textContent: n.b,
                onclick: function() {
                    C.Se();
                    return !1
                }
            });
            var b = d.a("li", {
                id: "menu-settings",
                children: [C.link]
            });
            a.insertBefore(b, a.firstChild);
            setInterval(function() {
                var a = 4 * e.nh / 3;
                e.nh = 0;
                if (e.b && !(e.b.sh ||
                        e.paused || l.paused)) {
                    var b = C.performance;
                    b.unshift(a);
                    b.length = 51;
                    C.Tf && (B.title = "[" + k.round(b[0] + b[1] + b[2]) + "fps] " + B.title.replace(/^\[\d+fps\]/, ""))
                }
                C.Ag && C.Ag()
            }, 250);
            g.Zd[87] = function() {
                "off" == l.kd ? l.vd(l.Qf) : l.vd("off");
                g.Je(n.ia, n.M[l.kd] || n.ha)
            };
            g.Zd[71] = function() {
                l.ae = !l.ae;
                C.cj();
                g.Je(n.S, l.ae ? n.K : n.J)
            };
            g.Zd[70] = function() {
                C.ii();
                g.Je("FPS", C.Tf ? n.K : n.J)
            }
        },
        performance: [0, 0, 0, 0],
        cj: function() {
            l.log("settings", "grid-" + (l.ae ? "on" : "off"));
            d.Ae("grid", l.ae ? "1" : "0");
            q.jd()
        },
        Rg: function(a) {
            for (var b =
                    d.a(0, {
                        id: a.id,
                        className: "section",
                        children: [d.a(0, {
                            className: "section_header clearfix",
                            children: [d.a("h2", {
                                className: "",
                                textContent: a.title
                            })]
                        }), d.a(0, {
                            className: "clanek",
                            children: [d.a("img", {
                                src: a.ud
                            }), d.a("p", {
                                textContent: a.Ph
                            })]
                        })],
                        parent: a.parent
                    }), b = d.a(0, {
                        className: "resp_table",
                        parent: b
                    }), c = d.a(0, {
                        className: "resp_table_inner",
                        parent: b
                    }), f = 0; f < a.rows.length; f++) {
                var v = d.a(a.rows[f].label ? "label" : "div", {
                    className: "resp_table_row " + (a.rows[f].className || ""),
                    parent: c
                });
                d.a(0, {
                    className: "resp_table_cell cell1",
                    textContent: a.rows[f].nd + ":",
                    parent: v
                });
                d.a(0, {
                    className: "resp_table_cell cell2",
                    children: a.rows[f].content,
                    parent: v
                })
            }
            return b
        },
        pf: function() {
            C.vd = null;
            delete C.Ag
        },
        Tf: !1,
        ii: function() {
            C.Tf = !C.Tf;
            C.Tf || (B.title = B.title.replace(/^\[\d+fps\]/, ""))
        },
        Lj: function(a) {
            var b = d.a("canvas", {
                title: n.Uc,
                width: 140,
                height: 21,
                className: "rc",
                onclick: C.ii
            });
            a.insertBefore(b, a.firstChild);
            var c = b.getContext("2d");
            c.strokeStyle = "#BBB";
            c.textBaseline = "middle";
            c.font = "10px 'Consolas', 'Lucida Console', 'Courier New', monospace";
            var f = c.createLinearGradient(0, 0, 0, 21);
            f.addColorStop(0, "#EEE");
            f.addColorStop(1, "#BBB");
            C.Ag = function() {
                c.clearRect(0, 0, b.width, b.height);
                c.beginPath();
                c.moveTo(100, 22 - (C.performance[0] || 0));
                for (var a = 1; a < C.performance.length; a++) c.lineTo(100 - 2 * a, 22 - (C.performance[a] || 0));
                c.stroke();
                c.lineTo(0, 22);
                c.lineTo(100, 22);
                c.lineTo(100, 22 - (C.performance[0] || 0));
                c.fillStyle = f;
                c.fill();
                c.fillStyle = "#888";
                c.fillText((" " + k.round(C.performance[0] + C.performance[1] + C.performance[2] || 0)).slice(-2), 103, 11);
                c.fillText("   fps",
                    99, 11)
            };
            C.Ag()
        },
        Id: function() {
            history.replaceState({
                zf: l.kd
            }, B.title, ja.Cj(l.kd, l.g))
        }
    };
    history.pushState || (C.Id = function() {});
    C.Hf = d.Qe("wind");
    C.Se = function() {
        function a(a) {
            a = sa + (59 < a ? 1 : a / 63) * (Aa - sa);
            a != F && (F = a, F == xa ? (M.style.visibility = "hidden", d.Qk()) : (M.style.visibility = "", d.Ae("dpr", F / xa)), l.resize(), l.log("settings", "resolution"))
        }

        function b() {
            l.vd(e.Xk(G));
            C.Id();
            c.className = "settings pq";
            c.parentNode.onscroll = function() {
                c.className = "settings";
                this.onscroll = null
            };
            m.value = ""
        }
        l.log("settings",
            "open");
        var c = z.create(null, n.b, !0);
        z.wg = C.pf;
        C.Id();
        c.className = "settings";
        z.Te = "#settings";
        z.ug = !0;
        d.a(0, {
            className: "section",
            children: [d.a(0, {
                className: "header clearfix",
                children: [d.a("h1", {
                    textContent: n.b
                })]
            }), d.a(0, {
                className: "subheader clearfix",
                children: [d.a(0, {
                    className: "destination",
                    textContent: n.Ta
                })]
            })],
            parent: c
        });
        d.a("ul", {
            className: "menu clearfix",
            children: [d.a("li", {
                    children: [d.a("a", {
                        href: "#settings-main",
                        textContent: n.T
                    })]
                }), d.a("li", {
                    children: [d.a("a", {
                        href: "#settings-wind",
                        textContent: n.U
                    })]
                }),
                d.a("li", {
                    children: [d.a("a", {
                        href: "#settings-colors",
                        textContent: n.R
                    })]
                })
            ],
            parent: c
        });
        var f = d.a("select", {
                onchange: function() {
                    l.log("settings", "language");
                    d.Fh("lang", this.value);
                    g.translate(this.value)
                }
            }),
            v = [],
            k;
        for (k in ba) v.push(k);
        v.sort();
        for (var h = 0; k = v[h]; h++) d.a("option", {
            value: k,
            textContent: ba[k].label + " [" + k + "]",
            parent: f,
            selected: ba[k] == n
        });
        var M, W = C.fe(a, (F - sa) / (Aa - sa) * 63, n.Ya, n.Xa);
        W.push(M = d.a("a", {
            textContent: n.Za,
            style: "display: block; " + (F == xa ? "visibility: hidden; " : "") + "text-align: center; margin-bottom: -0.6em; position: relative; top: -0.4em",
            onclick: function() {
                a(W[0].value = (xa - sa) / (Aa - sa) * 63)
            }
        }));
        v = d.a("select", {
            onchange: function() {
                l.Ug(this.value)
            }
        });
        d.a("option", {
            value: "auto",
            textContent: n.G + " (" + D.auto.Xc[+l.j][l.g].toUpperCase() + ")",
            parent: v,
            selected: "auto" == l.Kc
        });
        for (h = 0; h < X.length; h++) d.a("option", {
            value: X[h],
            textContent: X[h].toUpperCase(),
            parent: v,
            selected: l.Kc == X[h]
        });
        C.Rg({
            id: "settings-main",
            title: n.T,
            Ph: n.Va,
            ud: "/images/aside/aplikace.jpg",
            parent: c,
            rows: [{
                nd: n.Ua,
                content: [f]
            }, {
                nd: n.Wa,
                content: W
            }, {
                nd: n.H,
                content: [v],
                className: "mobile-only"
            }]
        });
        var G = e.th(l.Qf),
            m = d.a("select", {
                onchange: function() {
                    var a = this.value || C.Hf;
                    a && (l.vd(a), C.Id())
                }
            });
        C.vd = function(a) {
            m.value = -1 == ia.indexOf(a) ? "" : a;
            G = e.th(a);
            q.Hd[0].value = G.Hd;
            q.length[0].value = G.length;
            q.width[0].value = G.width;
            q.ce[0].value = G.ce;
            q.Rc[0].value = G.Rc;
            q.opacity[0].value = G.opacity;
            q.Wd[0].value = G.Wd;
            Ga.value = G.color
        };
        for (var Ga = d.a("select", {
                onchange: function() {
                    G.color = 1 * this.value;
                    b()
                }
            }), h = 0; h < ia.length; h++) "off" != ia[h] && d.a("option", {
            value: ia[h],
            textContent: n.M[ia[h]] || ia[h],
            parent: m
        });
        d.a("option", {
            value: "",
            textContent: n.ha,
            parent: m
        });
        m.value = -1 < ia.indexOf(l.Qf) ? l.Qf : "";
        for (h = 0; h < 2 * va.length; h++) d.a("option", {
            value: h,
            textContent: n.bb[h],
            parent: Ga,
            selected: G.color == h
        });
        var q = {};
        C.Rg({
            id: "settings-wind",
            title: n.U,
            Ph: n.cb,
            ud: "/images/aside/cary.jpg",
            parent: c,
            rows: [{
                nd: n.rb,
                content: [m],
                className: "highlighted"
            }, {
                nd: n.sb,
                content: q.Hd = C.fe(function(a) {
                    G.Hd = a;
                    b()
                }, G.Hd, n.ub, n.tb)
            }, {
                nd: n.hb,
                content: q.length = C.fe(function(a) {
                    G.length = a;
                    b()
                }, G.length, n.jb, n.ib)
            }, {
                nd: n.vb,
                content: q.width =
                    C.fe(function(a) {
                        G.width = a;
                        b()
                    }, G.width, n.xb, n.wb)
            }, {
                nd: n.yb,
                content: q.ce = C.fe(function(a) {
                    G.ce = a;
                    b()
                }, G.ce, n.Ab, n.zb)
            }, {
                nd: n.kb,
                content: q.Rc = C.fe(function(a) {
                    G.Rc = a;
                    b()
                }, G.Rc, n.mb, n.lb)
            }, {
                nd: n.ob,
                content: q.opacity = C.fe(function(a) {
                    G.opacity = a;
                    b()
                }, G.opacity, n.qb, n.pb)
            }, {
                nd: n.eb,
                content: q.Wd = C.fe(function(a) {
                    G.Wd = a;
                    b()
                }, G.Wd, n.gb, n.fb)
            }, {
                nd: n.ab,
                content: [Ga]
            }]
        });
        C.Lj(c.querySelector("#settings-wind .section_header"));
        h = d.a("input", {
            type: "checkbox",
            checked: l.ae,
            onclick: function() {
                l.ae = this.checked;
                C.cj()
            }
        });
        f = [{
            nd: n.S,
            content: [h],
            label: !0
        }];
        v = d.a("select", {
            onchange: function() {
                p.ld = wa[this.selectedIndex];
                p.jd();
                d.Ae("borders", this.selectedIndex)
            }
        });
        for (h = 0; h < wa.length; h++) d.a("option", {
            value: wa[h],
            textContent: n.Ra[h] || wa[h],
            parent: v,
            selected: wa[h] == p.ld
        });
        f.push({
            nd: n.Qa,
            content: [v]
        });
        for (var x in ea) {
            v = [];
            h = 0;
            for (k in ea[x]) v.push(k), h++;
            if (!(2 > h)) {
                for (var ka = d.a("select", {
                        onchange: function() {
                            var a = this.value.split("|");
                            l.Vg(a[0], a[1])
                        }
                    }), h = 0; h < v.length; h++) d.a("option", {
                    value: x + "|" + v[h],
                    textContent: v[h],
                    parent: ka,
                    selected: l.units[x] == v[h]
                });
                f.push({
                    nd: n.$a[x] || x,
                    content: [ka]
                })
            }
        }
        C.Rg({
            id: "settings-colors",
            title: n.R,
            Ph: n.Sa,
            ud: "/images/aside/mapy.jpg",
            parent: c,
            rows: f
        })
    };
    C.fe = function(a, b, c, f) {
        return [d.a("input", {
            type: "range",
            onchange: function() {
                a(1 * this.value)
            },
            min: 0,
            max: 63,
            value: b
        }), d.a("br"), d.a("span", {
            textContent: String(c)
        }), f]
    };
    "range" != d.a("input", {
        type: "range"
    }).type && (C.fe = function(a, b, c, f) {
        for (var v = Array(64).join("\u00b7") + "(o)" + Array(64).join("\u00b7"), y = [], h = 0; 64 > h; h++) y.push(d.a("option", {
            value: h,
            textContent: v.substr(63 - h, 66)
        }));
        y[void 0 === b ? 31 : k.round(b)].selected = !0;
        return [d.a("select", {
            style: "text-align: center; margin: auto; display: block; margin-bottom: -1em; width: 100%",
            onchange: function() {
                a(1 * this.value)
            },
            children: y
        }), d.a("br"), d.a("span", {
            textContent: String(c)
        }), f]
    });
    C.Re = function() {
        C.link.textContent = n.b;
        "#settings" == z.Te && C.Se()
    };
    var z = {
            Tc: function() {
                z.Fk();
                z.fd = d.Qc("aside");
                var a = d.Qc("menu-about").parentNode.parentNode;
                a.onclick = function() {
                    this.className = this.className ?
                        "" : "r"
                };
                a.ontouchstart = function(a) {
                    if (this.className && "A" != a.target.tagName) return this.className = "", !1
                };
                d.Qc("menu-about").onclick = function() {
                    z.Se("about", n.O, !0);
                    return !1
                };
                C.Tc();
                t.Tc()
            },
            Rj: function() {
                if (z.fd && (z.Te = location.href.replace(/.*\/|[?#].*/g, ""), z.ug = !0, z.$h(), z.ie)) return l.nf(z.ie.lat, z.ie.lon, 5), !0
            },
            create: function(a, b, c, f) {
                d.Qc("header").className = "";
                b = b ? d.Pc("{page} \u2013 VentuSky", {
                    page: b
                }) : "VentuSky";
                history.pushState && !f && (a ? history.pushState({
                    detail: a,
                    title: b,
                    sl: c
                }, b, a) : history.pushState({},
                    b));
                B.title = b;
                a && l.Oi(a);
                z.fd ? (z.pf(), a = z.fd.getElementsByTagName("div")[0], a.innerHTML = "", a.className = "") : z.fd = d.a(0, {
                    parent: B.body,
                    id: "aside",
                    children: [a = d.a(0, {
                        parent: B.body,
                        id: "aside_inner"
                    })]
                });
                B.body.className = c ? "widepanel" : "panel";
                d.a("span", {
                    onclick: z.close,
                    id: "aside_close_btn",
                    children: [d.a("span", {
                        className: "aside_close_btn_ico"
                    })],
                    parent: z.fd
                });
                return a
            },
            Se: function(a, b, c, f, v) {
                var k = z.create(a, b, c, f);
                d.a("span", {
                    className: "tz",
                    children: [d.a("span", {
                            className: "jh"
                        }), d.a("span", {
                            className: "ua"
                        }),
                        d.a("span", {
                            className: "xz"
                        })
                    ],
                    parent: k
                });
                z.Te = a;
                z.ug = !0;
                d.se(d.Pc("panel.php?link={link}&lang={lang}&id={id}", {
                    link: a,
                    lang: n.code,
                    id: v || ""
                }), function(a) {
                    k.innerHTML = a;
                    z.$h()
                })
            },
            Wg: function() {
                z.Se(this.href.replace(/.*\/|[?#].*/g, ""), this.textContent, !1, !1, this._auxId);
                return !1
            },
            Mi: function(a, b) {
                function c() {
                    g.className = e + g.offsetHeight + 12 > A.innerHeight ? "yy" : ""
                }

                function f(a) {
                    a.target.parentNode != g && v()
                }

                function v() {
                    z.Ni = !0;
                    setTimeout(function() {
                        z.Ni = !1
                    }, 333);
                    B.body.removeChild(g);
                    B.documentElement.removeEventListener("touchstart",
                        f, !1);
                    B.documentElement.removeEventListener("mousedown", f, !1);
                    B.documentElement.removeEventListener("wheel", f, !1)
                }
                if (!z.Ni) {
                    var k = l.Gg(a, b),
                        h = d.a("a", {
                            href: z.ri(a, b),
                            textContent: d.coords(k, 3 < P),
                            onclick: z.Wg
                        });
                    h.setAttribute("data-distance", "0 km");
                    var e = b / F,
                        g = d.a(0, {
                            id: "p",
                            style: "left: " + a / F + "px; top: " + e + "px",
                            parent: B.body,
                            children: [h]
                        });
                    d.se(d.Pc("ventusky_location.json.php?lat={lat}&lon={lon}&zoom={zoom}", k), function(a) {
                        try {
                            var b = JSON.parse(a || "[]")
                        } catch (f) {
                            return
                        }
                        for (a = 0; a < b.length; a++) {
                            var h =
                                b[a].url || d.Pc("{lat};{lon}", {
                                    lat: b[a].lat.toFixed(3),
                                    lon: b[a].lon.toFixed(3)
                                }),
                                h = d.a("a", {
                                    href: h,
                                    textContent: p.ji(b[a]),
                                    onclick: z.Wg
                                });
                            h._auxId = b[a].id;
                            h.setAttribute("data-distance", d.Ti(b[a].distance, 100) + " km");
                            g.appendChild(h)
                        }
                        c()
                    });
                    c();
                    B.documentElement.addEventListener("touchstart", f, !1);
                    B.documentElement.addEventListener("mousedown", f, !1);
                    B.documentElement.addEventListener("wheel", f, !1);
                    g.addEventListener("click", v, !1)
                }
            },
            Og: function() {
                for (var a = z.fd.querySelectorAll("[data-frame]"), b = 0; b <
                    a.length; b++)(function(a) {
                    for (var b = a.getAttribute("data-frame"), c = a.getElementsByTagName("select"), h = 0; h < c.length; h++) c[h].onchange = function() {
                        
                        var c = d.Pc(b, {
                            link: this.value
                        });

                        c = '../../getOverviewMaps/weatherinfo?'+c.split("?")[1];

                        d.se(c, function(b) {
                            a.innerHTML = b;
                            z.Og()
                        })
                    };
                    a.onclick = function(a) {
                        if (a = a.target.getAttribute("data-link")) {
                            a = d.Pc(b, {
                                link: a
                            });
                            
                            a = '../../getOverviewMaps/weatherinfo?'+a.split("?")[1];
                            var c = this;

                            d.se(a, function(a) {
                                c.innerHTML = a;
                                z.Og()
                            })
                        }
                    }
                })(a[b]);
                a = z.fd.querySelectorAll(".unroll select");
                for (b = 0; b < a.length; b++) {
                    var c = a[b];
                    c.parentNode.getAttribute("data-text") || (c.parentNode.setAttribute("data-text",
                        c.options[c.selectedIndex].textContent), c.addEventListener("change", c.Ig = function() {                 
                        this.parentNode.setAttribute("data-text", this.options[this.selectedIndex].textContent);
                    }, !1))
                }
            },
            $h: function() {
                d.Qc("aside_close_btn") && (d.Qc("aside_close_btn").onclick = z.close);
                z.Og();
                var a = d.Qc("star");
                if (a) {
                    for (var b = a.getAttribute("data-star").split(";"), b = {
                            lat: parseFloat(b[0]),
                            lon: parseFloat(b[1]),
                            name: b[2],
                            url: z.Te
                        }, c = !1, f = 0; f < z.dd.length; f++)
                        if (b.lon == z.dd[f].lon && b.lat == z.dd[f].lat || z.dd[f].url == b.url) {
                            z.dd[f].temporary ||
                                (c = !0);
                            z.ie = z.dd[f];
                            break
                        }
                    a.onclick = function() {
                        (c = !c) ? delete z.ie.temporary: z.ie.temporary = !0;
                        this.className = c ? "" : "star_empty";
                        z.bj()
                    };
                    z.ie || (z.ki(), z.ie = {
                        lon: b.lon,
                        lat: b.lat,
                        name: b.name || "",
                        url: z.Te
                    }, z.dd.push(z.ie), p.Vf());
                    c = !c;
                    a.onclick()
                }
                if (a = z.fd.querySelector("[data-astro]")) a = a.getAttribute("data-astro").split(";"), m.Mc.Td = {
                    Vi: +a[3]
                }, m.Tc(+a[0], +a[1], new Date(1E3 * a[2]))
            },
            pf: function() {
                z.wg && (z.wg(), delete z.wg);
                z.ug = !1;
                z.ie = null;
                z.bj();
                m.bk()
            },
            close: function() {
                z.fd && (z.pf(), z.fd.parentNode.removeChild(z.fd),
                    B.body.className = "", B.title = "VentuSky", delete z.fd, delete z.Te, l.Id(!0))
            },
            ri: function(a, b) {
                var c = l.Gg(a, b);
                return d.Pc("{lat};{lon}", {
                    lat: c.lat.toFixed(3),
                    lon: c.lon.toFixed(3)
                })
            },
            dd: [],
            Fk: function() {
                try {
                    var a = JSON.parse(localStorage.getItem("bookmarks"))
                } catch (b) {}
                a && (z.dd = a)
            },
            hj: function(a, b, c) {
                z.ki();
                z.dd.push({
                    lat: a,
                    lon: b,
                    name: c,
                    temporary: !0
                })
            },
            ki: function() {
                for (var a = [], b = 0; b < z.dd.length; b++) z.dd[b].temporary || a.push(z.dd[b]);
                z.dd = a
            },
            bj: function() {
                for (var a = [], b = 0; b < z.dd.length; b++) z.dd[b].temporary ||
                    a.push(z.dd[b]);
                try {
                    localStorage.setItem("bookmarks", JSON.stringify(a))
                } catch (c) {}
            }
        },
        ca = {
            block: {},
            Df: [],
            Li: function(a, b, c, f) {
                a = fa(a, 1 << c);
                a = c + "/" + a + "/" + b;
                var v = ca.block[a];
                if (v) return v;
                ca.block[a] = v = {
                    loaded: 0
                };
                for (b = 0; c = ["land", "border"][b]; b++) v[c] = d.a("img"), v[c].onload = function() {
                    this.onload = this.onerror = null;
                    v.loaded++;
                    3 == v.loaded && f()
                }, v[c].onerror = function() {
                    this.src = this.dk
                }, v[c].src = ca.uh(c, a + ".png"), v[c].dk = ca.uh(c, "empty.png");
                d.se(ca.uh("cities", a + ".js"), function(a) {
                    try {
                        v.cities = JSON.parse(a ||
                            "[]")
                    } catch (b) {
                        v.cities = []
                    }
                    v.loaded++;
                    3 == v.loaded && f()
                });
                ca.Df.push(a);
                50 < ca.Df.length && (a = ca.block[ca.Df[0]], a.land.onload = a.land.onerror = a.border.onload = a.border.onerror = null, delete ca.block[ca.Df[0]], ca.Df.shift(), a = null)
            },
            uh: function(a, b) {
                return Ta + a + "/" + b
            }
        },
        e = {};
    e.Sc = d.a("canvas");
    e.context = e.Sc.getContext("2d");
    e.md = [];
    e.h = "";
    e.Cf = "wind";
    e.pd = function() {
        e.tg = !0;
        g.Th();
        var a = Ea[e.h],
            b = a.kind;
        if ("wind" == b) var c = [a.Bd, a.Cd];
        else "wave" == b && (c = a.re ? [a.height, a.direction, a.re.height, a.re.direction] : [a.height, a.direction]);
        var f = l.Ed(),
            v = f + (a.wd || ""),
            k = {
                model: v,
                time: l.j,
                layer: c,
                cache: String(D[f].end).replace(/0+$/, "")
            },
            c = !0 === D[f].Kd[l.g].Sd ? !0 : D[f].Sd,
            h = D[f].Kd[l.g].size || D[f].size,
            f = d.Pc(Da.path, k);
        d.zi(f, function(c) {
            if (!(k.model != v || k.time - l.j)) {
                e.Cf != b && (e.Cf = b, g.Wc["wind-type"].refresh());
                e.Cf = b;
                var f = a.Ue || e.ak;
                e.Ue != f && (e.Ue = f, C.vd && "off" != l.kd && C.vd(l.kd));
                "wind" == b ? (e.Uh = c[0], e.Vh = c[1], e.ul = a.yd) : (e.sj = c[0], e.rj = c[1], e.pj = a.re, e.ql = a.If, e.tj = a.kh, e.rl = a.threshold, e.pj && (e.ml = c[2], e.ll =
                    c[3], e.kl = a.re.If, e.qj = a.re.kh, e.ol = a.re.threshold));
                e.qe = 720;
                e.Ud = 360;
                e.yj = 0;
                h.kf && (e.Ud *= 180 / (h.kf - h.Ji), e.yj = e.Ud * (90 - h.kf) / 180);
                e.tg = !1;
                g.Th();
                e.Bg()
            }
        }, c)
    };
    e.qe = 720;
    e.Ud = 360;
    e.le = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz_-0123456789";
    e.Ce = function(a) {
        for (var b = {}, c = 0; c < a.length; c++) b[a.charAt(c)] = c;
        return b
    }(e.le);
    e.Ue = e.ak = {};
    e.th = function(a) {
        a = e.Ue[a] || Sa[a] || a;
        a = a.slice(1);
        var b = {};
        b.Hd = e.Ce[a.charAt(0)];
        b.length = e.Ce[a.charAt(1)];
        b.width = e.Ce[a.charAt(2)];
        b.ce = e.Ce[a.charAt(3)];
        b.Rc = e.Ce[a.charAt(4)];
        b.opacity = e.Ce[a.charAt(5)];
        b.Wd = e.Ce[a.charAt(6)];
        b.color = e.Ce[a.charAt(7)] % (2 * va.length);
        return b
    };
    e.Xk = function(a) {
        return "0" + (e.le.charAt(a.Hd) + e.le.charAt(a.length) + e.le.charAt(a.width) + e.le.charAt(a.ce) + e.le.charAt(a.Rc) + e.le.charAt(a.opacity) + e.le.charAt(a.Wd) + e.le.charAt(a.color))
    };
    e.lk = function(a, b, c) {
        if ("off" == c) return {
            Hd: 0,
            opacity: 0
        };
        c = e.th(c);
        for (var f = c.width / 64 * 2.8 + .2, d = c.ce / 64 * 2.8 / 2, y = [], h = 0; 5 > h; h++) y.push(k.max(f + d * (h - 2), .2));
        f = c.Rc / 64 * 135 + 20;
        d = .45 * f;
        return {
            Hd: a *
                (c.Hd / 64 * 1.6 + .2) / ((b + 6) * (b + 6)),
            opacity: .7 * (1 - c.opacity / 64) + .3,
            color: va[c.color % va.length] || "#FFF",
            jg: Ra[c.color % va.length] || "#000",
            Ve: c.color >= va.length,
            pe: y,
            uj: c.width / 64,
            ce: c.ce / 64,
            length: (c.length / 64 * (.025 - .0055) + .0055) * (1.2 + b),
            Wd: 1 - (63 - c.Wd) / 64 / 8 - .003 * b,
            Jf: f - d,
            xi: 2 * d
        }
    };
    e.b = {};
    e.Bg = function() {
        var a = !!e.b.Ve;
        e.b = e.lk(H * J, P, l.kd);
        e.b.sh = !e.b.Hd;
        e.b.pe || (e.b.pe = [1]);
        e.Sc.style.opacity = k.min(e.b.opacity / (e.b.Ve ? q.N.opacity : 1), 1);
        e.context.strokeStyle = e.cg.strokeStyle = e.b.color;
        a != e.b.Ve && p.ka.insertBefore(e.Sc,
            e.b.Ve ? q.Sc : q.Sc.nextSibling);
        e.Ok();
        e.context.setLineDash && e.context.setLineDash([]);
        var a = "",
            b = Ea[e.h];
        "wave" == b.kind && b.re && (a = '<b style="color: ' + (e.tj ? e.b.jg : e.b.color) + '">' + n.Ub + '</b> <b style="color: ' + (e.qj ? e.b.jg : e.b.color) + '">' + n.Mb + "</b>");
        q.Ki.innerHTML = a
    };
    e.Tc = function() {
        e.pd()
    };
    e.Ok = function() {
        var a = k.round(e.b.Hd);
        if (e.md.length < a)
            for (var b = e.md.length; b < a; b++) e.md.push(e.Dh({}, 0));
        else e.md.length = a
    };
    e.Dh = function(a, b) {
        a.x = k.random() * (H + 2 * da) - da;
        a.y = k.random() * (J + 2 * da) - da;
        a.Rc = b + k.random() *
            e.b.xi;
        a.Lg = 0;
        a.Bf = -1;
        return a
    };
    e.lh = Date.now();
    e.nh = 0;
    e.cache = [];
    e.loop = function() {
        var a = Date.now(),
            b = 500 < a - e.lh ? 1 : k.min((a - e.lh) / 16, 10);
        e.nh++;
        e.lh = a;
        e.b.sh || e.paused || (a = e.context, a.globalCompositeOperation = "destination-in", a.globalAlpha = k.pow(e.b.Wd, b), a.fillRect(0, 0, H, J), a.globalCompositeOperation = "source-over", a.globalAlpha = 1, a.beginPath(), "wind" == e.Cf ? e.Lk(b) : "wave" == e.Cf && e.Kk(b))
    };
    e.Kk = function(a) {
        if (e.sj && e.rj) {
            var b = e.context,
                c = e.qe,
                f = e.Ud,
                d = e.yj,
                y = 512 * (1 << P),
                h = 6 * e.b.length * a,
                l = e.sj,
                g =
                e.rj,
                G = e.rl;
            b.lineWidth = h * (1 + 1.5 * e.b.uj);
            b.setLineDash && b.setLineDash(e.ql);
            e.context.strokeStyle = e.cg.strokeStyle = e.tj ? e.b.jg : e.b.color;
            for (var n = e.pj ? k.round(e.md.length / 8) : -1, m = 6 - 3.9375 * e.b.ce, q = 0; q < e.md.length / 4; q++) {
                var x = e.md[q];
                0 >= x.Rc && e.Dh(x, e.b.Jf);
                var p = 1E6 + k.round(x.x),
                    O = 3E6 + k.round(x.y),
                    p = e.cache[p] || (e.cache[p] = (k.round(x.x) + K) / y % 1 * c),
                    w = e.cache[O] || (e.cache[O] = Ha * k.atan(k.exp(((k.round(x.y) + L) / y * 2 - 1) * k.PI)) * f - d),
                    t = p % 1,
                    r = w % 1,
                    p = p | 0,
                    w = (w | 0) * c,
                    O = Z.te(t, r, l[w + p], l[w + p + 1], l[w + c + p], l[w + c + p +
                        1]);
                if (O > G) {
                    p = Z.Hj(t, r, g[w + p], g[w + p + 1], g[w + c + p], g[w + c + p + 1], k.PI / 90) / 90 * k.PI + k.PI;
                    0 < x.Bf && k.abs(x.Bf - p) > .25 * k.PI ? (x.Rc = 0, p = x.Bf) : x.Bf = p;
                    var u = 2 - k.min(x.Lg || 0, e.b.Jf) / e.b.Jf / 2,
                        r = k.PI / 2 * u,
                        w = k.sin(p) * h,
                        t = k.cos(p) * h,
                        u = k.max(O / m, 4) * (.5 + e.b.uj),
                        O = k.sin(p + r) * u,
                        S = k.cos(p + r) * u,
                        T = k.sin(p - r) * u,
                        p = k.cos(p - r) * u;
                    x.x += w;
                    x.y -= t;
                    b.moveTo(x.x + O, x.y - S);
                    b.quadraticCurveTo(x.x, x.y, x.x + T, x.y - p)
                }
                x.Lg += a;
                x.Rc -= 10 * a / u;
                if (x.x < 0 - da || x.x >= H + da || x.y < 0 - da || x.y >= J + da) x.Rc = 0;
                q == n && (b.stroke(), b.beginPath(), b.setLineDash && b.setLineDash(e.kl),
                    b.strokeStyle = e.cg.strokeStyle = e.qj ? e.b.jg : e.b.color, l = e.ml, g = e.ll, G = e.ol)
            }
            b.stroke()
        }
    };
    e.Lk = function(a) {
        if (e.Uh && e.Vh) {
            for (var b = e.qe, c = e.Ud, f = 512 * (1 << P), d = e.b.length * a * e.ul, y = e.Uh, h = e.Vh, l = [], g = 1; g < e.b.pe.length; g++) l.push(k.round(e.md.length / e.b.pe.length * g));
            var G = e.context;
            G.lineWidth = e.b.pe[0];
            for (var n = 0; n < e.md.length; n++) {
                var m = e.md[n];
                0 >= m.Rc && e.Dh(m, e.b.Jf);
                var g = 1E6 + k.round(m.x),
                    p = 2E6 + k.round(m.y),
                    g = e.cache[g] || (e.cache[g] = (k.round(m.x) + K) / f % 1 * b),
                    x = e.cache[p] || (e.cache[p] = Ha * k.atan(k.exp(((k.round(m.y) +
                        L) / f * 2 - 1) * k.PI)) * c),
                    q = g % 1,
                    O = x % 1,
                    g = g | 0,
                    x = (x | 0) * b,
                    p = Z.te(q, O, y[x + g], y[x + g + 1], y[x + b + g], y[x + b + g + 1]) - 127,
                    g = Z.te(q, O, h[x + g], h[x + g + 1], h[x + b + g], h[x + b + g + 1]) - 127;
                G.moveTo(m.x, m.y);
                m.x += p * d;
                m.y -= g * d;
                G.lineTo(m.x, m.y);
                for (g = l.length - 1; 0 <= g; g--) n == l[g] && (G.stroke(), G.beginPath(), G.lineWidth = e.b.pe[g + 1]);
                m.Rc -= a;
                if (m.x < 0 - da || m.x >= H + da || m.y < 0 - da || m.y >= J + da) m.Rc = 0
            }
            G.stroke()
        }
    };
    e.resize = function() {
        e.cache.length = 0;
        e.Sc.width = e.Jg.width = H;
        e.Sc.height = e.Jg.height = J;
        e.context.lineWidth = 2;
        e.context.lineCap = "butt";
        e.Bg()
    };
    e.Jg = d.a("canvas");
    e.cg = e.Jg.getContext("2d");
    e.xd = {
        x: 0,
        y: 0
    };
    e.Ng = function() {
        d.setTransform(e.Sc, "translate(" + e.xd.x / F + "px, " + e.xd.y / F + "px)")
    };
    e.moveBy = function(a, b, c) {
        e.cache.length = 0;
        e.xd.x += a;
        e.xd.y += b;
        if (c) return e.Bg(), e.Zi();
        e.Ng()
    };
    e.Zi = function() {
        for (var a = e.xd.x, b = e.xd.y, c = 0; c < e.md.length; c++) e.md[c].x = fa(e.md[c].x + a, H), e.md[c].y = fa(e.md[c].y + b, J);
        e.xd.x = 0;
        e.xd.y = 0;
        e.Ng();
        if (1 > H - k.abs(a) || 1 > J - k.abs(b)) e.context.clearRect(0, 0, f, d);
        else {
            c = e.Jg;
            c.getContext("2d");
            var f = c.width,
                d = c.height;
            e.cg.clearRect(0,
                0, f, d);
            e.cg.drawImage(e.Sc, k.max(-a, 0), k.max(-b, 0), H - k.abs(a), J - k.abs(b), k.max(a, 0), k.max(b, 0), H - k.abs(a), J - k.abs(b));
            e.context.clearRect(0, 0, f, d);
            e.context.drawImage(c, 0, 0)
        }
    };
    var q = {};
    q.Sc = d.a("canvas");
    q.context = q.Sc.getContext("2d");
    q.Tc = function() {
        "imageSmoothingEnabled" in q.context ? q.context.imageSmoothingEnabled = !1 : q.context.mozImageSmoothingEnabled = q.context.webkitImageSmoothingEnabled = q.context.msImageSmoothingEnabled = !1;
        q.pd();
        q.label = d.a("span", {
            className: "ew",
            parent: p.Pd
        });
        q.i = d.a(0, {
            id: "r",
            parent: B.body
        });
        q.Kf();
        E.Tc()
    };
    q.Ki = d.a(0, {
        id: "l"
    });
    q.wk = function() {
        for (var a in u)(function(a) {
            if (a.hf)
                for (var c in u[a.hf]) c in a || (a[c] = u[a.hf][c]);
            a.ag || (a.o ? a.ag = function(c, f) {
                var h = ea[a.o][l.units[a.o]];
                h.Xg ? c = h.Xg(c) : c = h.Oc * c;
                !a.Nh && 0 > c && (c = 0);
                a.hk && c > a.max / 1E3 && (c = a.max / 1E3);
                return d.Ti(c, 1 / ((a.Hg && a.Hg[l.units[a.o]] || {}).precision || h.precision || (f ? 1 : .01)))
            } : a.ag = function(a) {
                return a
            });
            a.A || (a.A = function(a) {
                return a
            });
            if (!a.kg)
                for (a.kg = [], c = 0; c < a.scale.length; c += 6) {
                    var f = parseInt(a.scale.substr(c,
                        6), 36);
                    a.kg.push([(f >> 16) % 256, (f >> 8) % 256, f % 256, 2 * (f >> 24)])
                }
        })(u[a])
    };
    q.fj = function(a) {
        q.N && q.N.o && g.Wc[q.N.o] && g.Wc[q.N.o].ef();
        var b = q.N ? !!q.N.Nd : !1;
        a = u[a];
        q.Sc.style.opacity = a.opacity;
        q.N = a;
        q.N && q.N.o && g.Wc[q.N.o] && g.Wc[q.N.o].Od(l.units[q.N.o]);
        q.Kf();
        q.ld != q.N.ld && (q.ld = q.N.ld, p.jd());
        b != !!q.N.Nd && p.ka.insertBefore(p.je, q.N.Nd ? p.ee : q.Sc)
    };
    q.pd = function() {
        var a = l.Ed();
        "auto" == l.Kc && g.Wc.model.Dg(D[a].Zf);
        q.fj(l.g);
        q.jd(!0);
        var b = {
            od: l.Ed(),
            time: l.j,
            gd: l.g
        };
        q.fh = function(a, f) {
            a = k.round(a);
            f = k.round(f);
            if (q.N.Nd && 255 == p.jf.getImageData(a, f, 1, 1).data[3]) return null;
            var d = E.hh(k.floor((a + K) / 256), k.floor((f + L) / 256), P, b);
            return d && 2 == d.status ? q.N.ag(d.values[(f + L) % 256 * 256 + (a + K) % 256] / 1E3) + (q.N.o ? " " + l.units[q.N.o] : "") : null
        }
    };
    q.onmousemove = function(a, b, c) {
        "SPAN" == c.tagName && (c = c.parentNode);
        c = "A" == c.tagName ? c.getBoundingClientRect().bottom * F - q.label.offsetHeight - c.offsetHeight - 6 * F : b;
        d.setTransform(q.label, " translate(-50%, 0) scale(" + F + ") translate(" + a / F + "px, " + c / F + "px)");
        0 > a ? q.label.style.display = "none" :
            (a = q.fh(a, b), null !== a ? (q.label.innerHTML = a, q.label.style.display = "") : q.label.style.display = "none")
    };
    q.fh = function() {
        return null
    };
    q.wh = function(a, b) {
        for (var c = {
                od: l.Ed(a),
                time: new Date(a),
                gd: l.g
            }, f = k.floor(K / 256), d = k.floor(L / 256), y = k.ceil((K + H) / 256) + 1 - f, h = k.ceil((L + J) / 256) + 1 - d, e = y * h, g = 0, G = 0; G < y; G++)
            for (var n = 0; n < h; n++) {
                var m = E.hh(f + G, d + n, P, c, function() {
                    g++;
                    g == e && b()
                });
                m && 0 < m.status && g++
            }
        g == e && b()
    };
    q.ck = function(a, b, c) {
        if (a.values) {
            for (var f = 256 / 7, d = 256 / 7, y = b % 2, h = k.min(q.N.opacity / .6, 1), l = f / 2; 256 > l; l +=
                f)
                for (var e = d / 2 + ((y = !y) ? d / 4 : -d / 4); 256 > e; e += d) {
                    var g = k.round(l),
                        n = k.round(e),
                        m = q.N.ag(a.values[256 * n + g] / 1E3);
                    q.context.globalAlpha = "0" != m ? h : h / 2;
                    q.context.fillText(m, 256 * b - K + g, 256 * c - L + n)
                }
            q.context.globalAlpha = 1
        }
    };
    q.jd = function(a) {
        a && clearTimeout(q.Yi);
        var b = !1,
            c = {
                od: l.Ed(),
                time: l.j,
                gd: l.g
            };
        q.context.clearRect(0, 0, H, J);
        for (var f = k.floor(K / 256), d = k.floor(L / 256), y = k.floor((K + H) / 256), h = k.floor((L + J) / 256), e = k.round((K + H / 2) / 256), n = k.round((L + J / 2) / 256), G = (y - f + 1) * (h - d + 1), m = 1, t = 0, r = 0, x = r = 1, ka = 3; G;) {
            if (e >= f &&
                n >= d && e <= y && n <= h) {
                var O = E.hh(e, n, P, c, a && q.jd);
                O && O.ud && (q.context.drawImage(O.ud.canvas, O.ud.x, O.ud.y, 256, 256, 256 * e - K, 256 * n - L, 256, 256), l.ae && q.ck(O, e, n));
                O && 2 == O.status || (b = !0);
                G--
            }--r || (r = -t, t = m, m = r, --ka || (x++, ka = 2), r = x);
            e += m;
            n += t
        }
        b || p.Vf();
        q.tg = b;
        g.Th()
    };
    q.Fd = [];
    q.Kf = function() {
        if (q.i && q.N) {
            q.i.onclick = null;
            q.i.className = q.i.title = "";
            q.Fd.length = 0;
            var a = q.N,
                b = a.min,
                c = a.max;
            if (l.units[a.o]) {
                var f = ea[a.o][l.units[a.o]],
                    v = a.Hg && a.Hg[l.units[a.o]] || {};
                f.rh && (q.i.className = "lb", q.i.title = d.Pc(n.Tb, {
                        unit: f.rh
                    }),
                    q.i.onclick = function() {
                        l.Vg(a.o, f.rh);
                        return !1
                    });
                q.Fd.push({
                    yf: !0,
                    text: l.units[a.o]
                });
                v.i ? y = v.i : f.i && (y = f.i);
                "undefined" != typeof f.Bk && (b = f.Bk);
                "undefined" != typeof f.Ak && (c = f.Ak)
            }
            if (!y)
                for (var v = (c - b) / 14, y = [], c = 0; 15 > c; c++) y.push(b + c * v);
            b = [];
            for (c = 0; c < y.length; c++) b.push(a.kg[k.round((k.min(k.max(y[c], a.min), a.max) - a.min) / a.step)]);
            for (c = y.length - 1; 0 <= c; c--) {
                var v = b[c],
                    h = v[3] / 255;
                q.Fd.push({
                    text: a.ag(y[c] / 1E3, !0),
                    lj: 144 < (.2989 * v[0] + .587 * v[1] + .114 * v[2]) * h + 119 * (1 - h) ? "#000" : "#FFF",
                    ci: "rgba(" + v.slice(0,
                        3).join(",") + "," + h.toFixed(2) + ")"
                })
            }
            q.Jj()
        }
    };
    q.Jj = function() {
        for (; q.i.firstChild;) q.i.removeChild(q.i.firstChild);
        for (var a = 0; a < q.Fd.length; a++) {
            var b = q.Fd[a];
            d.a("span", {
                textContent: b.text,
                className: b.yf ? "zh" : "jd",
                style: b.yf ? "" : "background: " + b.ci + "; color: " + b.lj,
                parent: q.i
            })
        }
        q.i.appendChild(q.Ki)
    };
    q.resize = function() {
        q.Sc.width = H;
        q.Sc.height = J;
        q.context.font = Xa + " i, Segoe UI, sans-serif";
        q.context.textAlign = "center";
        q.context.textBaseline = "middle";
        q.context.fillStyle = "#000";
        q.jd()
    };
    q.xd = {
        x: 0,
        y: 0
    };
    q.Ng = function() {
        d.setTransform(q.Sc, "translate(" + q.xd.x + "px, " + q.xd.y + "px)")
    };
    q.Pf = -1;
    q.moveBy = function(a, b, c) {
        clearTimeout(q.Yi);
        c ? q.jd(!0) : (q.jd(), q.Yi = setTimeout(function() {
            q.jd(!0)
        }, 500))
    };
    var p = {};
    p.je = d.a("canvas");
    p.jf = p.je.getContext("2d");
    p.ee = d.a("canvas");
    p.bf = p.ee.getContext("2d");
    p.dg = d.a("canvas");
    p.hd = p.dg.getContext("2d");
    p.resize = function() {
        d.setTransform(p.Pd, "scale(" + 1 / F + ")");
        p.Pd.style.width = H + "px";
        p.Pd.style.height = J + "px";
        p.dg.width = p.je.width = p.ee.width = H;
        p.dg.height = p.je.height =
            p.ee.height = J;
        p.hd.fillStyle = "#555";
        p.hd.clearRect(0, 0, H, J);
        p.jf.fillStyle = "#555";
        p.jd(!0)
    };
    p.Gf = [];
    p.he = [];
    p.gk = "WebkitFontSmoothing" in B.documentElement.style;
    p.wh = function(a, b, c) {
        var f = k.floor((a + H) / 512) + 1,
            d = k.floor(b / 512);
        b = k.floor((b + J) / 512) + 1;
        for (a = k.floor(a / 512); a < f; a++)
            for (var y = d; y < b; y++) ca.Li(a, y, c, function() {})
    };
    p.Bh = !1;
    p.Sk = function() {
        p.Bh || (p.Bh = !0, requestAnimationFrame(p.jd))
    };
    p.jd = function(a) {
        p.Bh = !1;
        p.bf.clearRect(0, 0, H, J);
        a && p.jf.clearRect(0, 0, H, J);
        a = p.ld || q.ld || "#FFF";
        "#FFF" != a &&
            (p.bf.fillStyle = a);
        var b = k.floor(K / 512),
            c = k.floor((K + H) / 512) + 1,
            f = k.floor(L / 512),
            d = k.floor((L + J) / 512) + 1;
        for (p.he.length = 0; b < c; b++)
            for (var y = f; y < d; y++) {
                var h = ca.Li(b, y, P, p.Sk);
                if (h && 3 == h.loaded) {
                    p.jf.clearRect(512 * b - K, 512 * y - L, 512, 512);
                    p.jf.drawImage(h.land, 512 * b - K, 512 * y - L);
                    p.bf.drawImage(h.border, 512 * b - K, 512 * y - L);
                    for (var l = 0; l < h.cities.length; l++) p.he.push({
                        x: 512 * b - K + h.cities[l].x,
                        y: 512 * y - L + h.cities[l].y,
                        size: k.min(k.max(k.floor(k.log(h.cities[l].population) - 16 + P), 1), 5),
                        name: p.ji(h.cities[l]),
                        url: h.cities[l].url
                    });
                    "#FFF" != a && (p.bf.globalCompositeOperation = "source-atop", p.bf.fillRect(512 * b - K, 512 * y - L, 512, 512), p.bf.globalCompositeOperation = "source-over")
                }
            }
        p.he.Af = p.he.length;
        p.Vf()
    };
    p.ji = function(a) {
        return a.name + (/[a-z]/i.test(a.name || !a.ascii) ? "" : "\r\n(" + a.ascii + ")")
    };
    p.Vf = function() {
        if (p.Pd) {
            p.he.length = p.he.Af;
            for (var a = p.he, b = 512 * (1 << P), c = {}, f = 0; f < z.dd.length; f++) {
                var v = z.dd[f],
                    y = (180 + v.lon) / 360 * b - K,
                    h = l.eh((90 - v.lat) / 180) * b - L;
                if (!(-512 > y || y > H + 512 || -512 > h || h > J + 512)) {
                    for (var e = 0; e < a.length; e++) {
                        var g = a[e].x -
                            y,
                            G = 2 * (a[e].y - h);
                        c[e] = k.min(g * g + G * G, c[e] || Infinity)
                    }
                    a.push({
                        x: y,
                        y: h,
                        Jd: !0,
                        size: 5,
                        name: v.name,
                        url: v.url || z.ri(y, h),
                        value: q.fh(y, h)
                    })
                }
            }
            for (f = b = 0; f < a.length; f++) 32 > c[f] || (p.Gf[b] || (p.Gf[b] = d.a("a", {
                className: "qo",
                children: ["", d.a("span")],
                parent: p.Pd,
                onclick: z.Wg,
                onmousedown: function() {
                    return !1
                }
            })), v = p.Gf[b++], y = 2E3 > c[f], v.className = "qo am " + (a[f].Jd ? "bf" : ["ci", "sd", "nt", "la", "ji"][a[f].size - 1]) + (y ? " eg" : ""), h = 0, y ? (v.firstChild.data = "", v.removeAttribute("data-value"), v.title = a[f].name.trim() + (a[f].value ?
                (a[f].name.trim() ? ", " : "") + a[f].value : "")) : (a[f].value && v.setAttribute("data-value", a[f].name.trim() ? a[f].value : ""), v.firstChild.data = a[f].name.trim() || a[f].value, v.title = "", p.gk && (h = v.getBoundingClientRect().width % 2 / 2)), d.setTransform(v, "translate(" + (h + a[f].x).toFixed(3) + "px, " + a[f].y.toFixed(3) + "px) translate(-50%, -100%)"), v.href = a[f].url);
            for (; p.Gf[b];) d.setTransform(p.Gf[b++], "translate(-10000px, -10000px)")
        }
    };
    p.Tc = function() {
        function a(a, b, c) {
            f || (f = []);
            for (var e = P + a, g = 0; g < f.length; g++) e += f[g].zoom;
            g = k.log(k.ceil(J / 512)) / k.log(2);
            if (!(e < g || 9 < e)) {
                l.pause();
                f.push({
                    x: b,
                    y: c,
                    zoom: a,
                    scale: k.pow(2, a)
                });
                var n = K,
                    m = L,
                    q = P;
                a = [];
                p.hd.clearRect(0, 0, H, J);
                d.Ih(p.ka, b / F + "px " + c / F + "px");
                for (g = 0; g < f.length; g++) n = (n + f[g].x) * f[g].scale - f[g].x, m = (m + f[g].y) * f[g].scale - f[g].y, q += f[g].zoom, p.hd.translate(f[g].x, f[g].y), p.hd.scale(f[g].scale, f[g].scale), p.hd.translate(-f[g].x, -f[g].y), a.push("translate(" + (f[g].x - b) + "px, " + (f[g].y - c) + "px)"), a.push("scale(" + f[g].scale + ")"), a.push("translate(" + -(f[g].x - b) + "px, " + -(f[g].y -
                    c) + "px)");
                p.ka.className = "tm";
                d.setTransform(p.ka, a.join(" "));
                p.hd.drawImage(p.je, 0, 0);
                p.hd.drawImage(p.ee, 0, 0);
                p.hd.setTransform(1, 0, 0, 1, 0, 0);
                clearTimeout(v);
                v = setTimeout(function() {
                    p.ka.className = "";
                    d.setTransform(p.ka, "");
                    l.move(n, m, q);
                    f = null;
                    v = setTimeout(function() {
                        p.ka.className = "tm";
                        p.hd.clearRect(0, 0, H, J)
                    }, 50);
                    l.Rh()
                }, 500)
            }
        }
        p.ka = d.a(0, {
            id: "h",
            className: "tm",
            parent: B.body
        });
        p.ka.appendChild(p.je);
        p.ka.appendChild(q.Sc);
        p.ka.appendChild(e.Sc);
        p.ka.appendChild(p.ee);
        var b;
        Ba(p.ka, function(a) {
            var c =
                this;
            clearInterval(b);
            var f = K,
                d = L,
                v = K,
                e = L,
                g = a.clientX,
                n = a.clientY,
                m = Date.now(),
                q = !1;
            return {
                qf: function(a) {
                    if (!q) {
                        if (2 > k.abs(a.clientX - g) && 2 > k.abs(a.clientY - n)) return;
                        l.pause();
                        q = !0;
                        c.className = "os"
                    }
                    l.move(f + (g - a.clientX) * F, d + (n - a.clientY) * F, P);
                    var b = K,
                        y = L;
                    setTimeout(function() {
                        v = b;
                        e = y
                    }, 100);
                    m = Date.now()
                },
                rf: function(a) {
                    c.className = "";
                    if (q) {
                        var f = K - v,
                            d = L - e,
                            y = K,
                            M = L,
                            W = m + 500;
                        b = setInterval(function() {
                            var a = W - Date.now(),
                                c = 1 - k.pow(a / 500, 3);
                            0 > a || 5 > (k.abs(f) + k.abs(d)) * c ? (clearInterval(b), l.Rh()) : l.move(y +
                                f * c, M + d * c, P)
                        }, 13)
                    } else a.target == p.Pd && z.Mi(g * F, n * F)
                }
            }
        });
        p.ka.ontouchstart = p.hl;
        p.ka.onmousemove = function(a) {
            q.onmousemove(a.clientX * F, a.clientY * F, a.target)
        };
        p.ka.onmouseleave = function() {
            q.onmousemove(-1E4, -1E4, {})
        };
        g.B.onclick = function() {
            a(1, H / 2, J / 2)
        };
        g.C.onclick = function() {
            a(-1, H / 2, J / 2)
        };
        var c = !1;
        Date.now();
        "onwheel" in p.ka || "onmousewheel" in p.ka || p.ka.addEventListener("DOMMouseScroll", function(a) {
            return this.onwheel(a)
        });
        p.ka.onmousewheel = p.ka.onwheel = function(b) {
            if (c) return !1;
            c = !0;
            setTimeout(function() {
                c = !1
            }, 45);
            Date.now();
            0 > (b.detail || -b.wheelDelta || b.deltaY) ? a(1, b.clientX * F, b.clientY * F) : a(-1, b.clientX * F, b.clientY * F);
            return !1
        };
        var f, v;
        p.Pd = d.a(0, {
            parent: p.ka,
            id: "z"
        });
        d.Ih(p.Pd, "0 0")
    };
    p.hl = function() {
        function a() {
            d.setTransform(p.ka, "translate(" + f + "px, " + v + "px) scale(" + e + ")")
        }

        function b() {
            var b = 1E3 * q;
            d.ij(p.ka, b + "ms");
            p.wh(K * n - h * F, L * n - g * F, P + m);
            setTimeout(function() {
                f = h;
                v = g;
                e = n;
                a();
                setTimeout(function() {
                    d.ij(p.ka, "");
                    setTimeout(c, 50)
                }, b)
            }, 50)
        }

        function c() {
            p.hd.clearRect(0, 0, H, J);
            p.hd.translate(h *
                F, g * F);
            p.hd.scale(n, n);
            p.hd.drawImage(p.je, 0, 0);
            p.hd.drawImage(p.ee, 0, 0);
            p.hd.setTransform(1, 0, 0, 1, 0, 0);
            l.move(K * n - h * F, L * n - g * F, P + m);
            v = f = 0;
            e = 1;
            a();
            l.Rh()
        }
        if (!B.ontouchstart) {
            p.ka.className = "";
            d.Ih(p.ka, "0 0");
            var f = 0,
                v = 0,
                e = 1,
                h = 0,
                g = 0,
                n = 1,
                m = 0,
                q = 0,
                t = !1,
                r = k.log(k.ceil(J / 512)) / k.log(2),
                x = [];
            B.ontouchstart = function(a) {
                for (var b = 0; b < a.changedTouches.length; b++) x.push({
                    x: (a.changedTouches[b].clientX - f) / e,
                    y: (a.changedTouches[b].clientY - v) / e,
                    clientX: a.changedTouches[b].clientX,
                    clientY: a.changedTouches[b].clientY,
                    id: a.changedTouches[b].identifier
                });
                !t && 1 < x.length && (t = !0, l.pause());
                return !1
            };
            B.ontouchend = B.ontouchcancel = function(a) {
                for (var f = 0; f < a.changedTouches.length; f++)
                    for (var h = 0; h < x.length; h++)
                        if (x[h].id == a.changedTouches[f].identifier) {
                            x.splice(h, 1);
                            break
                        }
                if (!x.length)
                    if (B.ontouchstart = B.ontouchmove = B.ontouchend = B.ontouchcancel = null, t) m ? b() : c();
                    else if (a.target.onclick) a.target.onclick();
                else a.target == p.Pd && z.Mi(a.changedTouches[0].clientX * F, a.changedTouches[0].clientY * F)
            };
            B.ontouchmove = function(b) {
                for (var c =
                        0; c < x.length; c++) {
                    x[c].df = 0;
                    for (var d = x[c].Lf = 0; d < b.changedTouches.length; d++)
                        if (x[c].id == b.changedTouches[d].identifier) {
                            x[c].clientX = b.changedTouches[d].clientX;
                            x[c].clientY = b.changedTouches[d].clientY;
                            x[c].df = (b.changedTouches[d].clientX - f) / e - x[c].x;
                            x[c].Lf = (b.changedTouches[d].clientY - v) / e - x[c].y;
                            break
                        }
                }
                if (!t)
                    if (3 < k.abs(x[0].df) || 3 < k.abs(x[0].Lf)) t = !0, l.pause();
                    else return;
                l.pause();
                if (1 == x.length) f += x[0].df * e, v += x[0].Lf * e, h += x[0].df * e, g += x[0].Lf * e;
                else if (2 <= x.length) {
                    b = x[0];
                    var p = x[1],
                        c = b.clientX,
                        d = b.clientY,
                        u = p.x - b.x,
                        z = p.y - b.y,
                        S = p.clientX - c,
                        p = p.clientY - d,
                        T = u * u + z * z;
                    if (0 < T) {
                        var N = (u * S + z * p) / T,
                            T = (u * p - z * S) / T,
                            N = k.sqrt(N * N + T * T);
                        f = c + S / 2 - (b.x + u / 2) * N;
                        v = d + p / 2 - (b.y + z / 2) * N;
                        e = N;
                        N = k.log(N) / k.log(2);
                        m = k.max(k.min(k.round(N + P), 9), r) - P;
                        q = k.abs(m - N);
                        N = k.pow(2, m);
                        h = c + S / 2 - (b.x + u / 2) * N;
                        g = d + p / 2 - (b.y + z / 2) * N;
                        n = N
                    }
                }
                a();
                for (c = 50; c < x.length; c++) x[c].x = (x[c].clientX - f) / e, x[c].y = (x[c].clientY - v) / e;
                return !1
            }
        }
    };
    var H, J, P = 3,
        K = 1600,
        L = 800,
        l = {
            Ll: function(a) {
                return (2 * k.atan(k.exp((2 * a - 1) * k.PI)) - k.PI / 2) / k.PI * 180
            }
        },
        Ha = 2 / k.PI,
        Za =
        2 * k.PI;
    l.xf = function(a) {
        return Ha * k.atan(k.exp((2 * a - 1) * k.PI))
    };
    l.eh = function(a) {
        return k.log(k.tan(a * k.PI / 2)) / Za + .5
    };
    l.move = function(a, b, c) {
        b = k.round(k.max(k.min(b, 512 * (1 << c) - J), 0));
        a = k.round(a);
        var f = K - a,
            d = L - b,
            g = P - c;
        K = a;
        L = b;
        P = c;
        e.moveBy(f, d, g);
        q.moveBy(f, d, g);
        a = !1;
        g ? p.jf.drawImage(p.dg, 0, 0) : a = !0;
        p.jd(a);
        l.Tk()
    };
    l.loop = function() {
        l.paused || e.loop()
    };
    l.pause = function() {
        l.paused = !0;
        p.Pd.style.display = "none"
    };
    l.Rh = function() {
        l.paused = !1;
        K = fa(K, 512 * (1 << P));
        p.Pd.style.display = "";
        q.jd(!0);
        e.Zi();
        l.Id()
    };
    l.nf = function(a, b, c) {
        var f = 512 * (1 << c);
        K = (180 + b) / 360 * f - (!z.fd || H < 780 * F ? H : H - 540 * F) / 2;
        L = l.eh((90 - a) / 180) * f - J / 2;
        l.move(K, L, c)
    };
    l.Gg = function(a, b) {
        var c = 512 * (1 << P);
        return {
            lat: 90 - 180 * l.xf((L + b) / c),
            lon: ((K + a) / c * 360 - 180) % 180,
            zoom: P
        }
    };
    l.Fg = function() {
        return l.Gg(H / 2, J / 2)
    };
    l.Tk = function() {
        clearTimeout(l.Uk);
        l.Uk = setTimeout(function() {
            try {
                localStorage.setItem("last", JSON.stringify(l.Fg()))
            } catch (a) {}
        }, 500)
    };
    l.Ek = function() {
        try {
            var a = JSON.parse(localStorage.getItem("last"))
        } catch (b) {}
        if (a && a.lon && a.lat && a.zoom) return a
    };
    var za = [],
        U = {};
    l.Pk = function() {
        for (var a = {
                Xc: {},
                Dd: {},
                c: {}
            }, b = X.length - 1; 0 <= b; b--) {
            var c = D[X[b]];
            c.c = {};
            c.Xc = {};
            c.Dd = {};
            for (var f in c.Kd) {
                var d = c.Kd[f];
                c.c[f] = [];
                a.c[f] || (a.c[f] = []);
                for (var k = d.start || c.start, h = d.end || c.end, d = 36E5 * (d.Yd || c.Yd), e = k; e <= h; e += d) c.c[f].push(e), a.c[f].push(e), c.Xc[e] || (c.Xc[e] = {}), a.Xc[e] || (a.Xc[e] = {}), a.Xc[e][f] = c.Xc[e][f] = X[b];
                for (e = k; e <= h; e += 36E5) c.Dd[e] || (c.Dd[e] = {}), a.Dd[e] || (a.Dd[e] = {}), a.Dd[e][f] = c.Dd[e][f] = !0
            }
        }
        for (f in a.c) {
            a.c[f].sort(function(a, b) {
                return b - a
            });
            c = [];
            for (b = a.c[f].length - 1; 0 <= b; b--) a.c[f][b] != a.c[f][b + 1] && c.push(a.c[f][b]);
            a.c[f] = c
        }
        D.auto = a;
        for (b = 0; b < aa.length; b++)
            if (a = aa[b], a.f)
                for (f = 0; f < a.f.length; f++) c = a.f[f], U[c.id] = {
                    id: c.id,
                    file: c.file,
                    wd: c.wd,
                    group: a.id,
                    qk: f,
                    pg: a.kind,
                    h: c.h || "",
                    label: c.label || c.id,
                    Ah: c.Ah,
                    description: c.description || a.description || a.id
                }, za.push(U[c.id]), a.f[f].zg && (a.zg = c.id);
            else U[a.id] = {
                id: a.id,
                file: a.file,
                wd: a.wd,
                group: a.id,
                h: a.h || "",
                description: a.description || a.id
            }, za.push(U[a.id])
    };
    l.kd = "normal";
    l.j = new Date(I.now);
    l.Kc = I.model;
    l.Ed = function(a) {
        return D[l.Kc].Xc[+(a || l.j)][l.g]
    };
    l.setTime = function(a) {
        if (D[l.Kc].Xc[+a] && D[l.Kc].Xc[+a][l.g]) l.j = new Date(a);
        else {
            for (var b = D[l.Kc].c[l.g], c = Infinity, f = b[0], d = 0; d < b.length; d++) {
                var e = k.abs(b[d] - a);
                if (e < c && (c = e, f = b[d], !e)) break
            }
            l.j = new Date(f)
        }
        g.pd()
    };
    l.Qf = "normal";
    l.jj = function(a) {
        l.kd = a;
        "off" != a ? l.Qf = a : e.context.clearRect(0, 0, H, J);
        var b = -1 == ia.indexOf(l.kd);
        g.Wc["wind-type"].Od(b ? "" : l.kd);
        e.Bg();
        C.vd && "off" != a && C.vd(a);
        b && (C.Hf = a, d.Ae("wind", C.Hf))
    };
    l.g = "temperature";
    l.Hh = function(a) {
        l.g = a;
        D[l.Kc].Xc[+l.j] && D[l.Kc].Xc[+l.j][l.g] || l.setTime(l.j);
        g.c.update();
        e.h != U[l.g].h && (e.h = U[l.g].h, e.pd())
    };
    l.Ff = function(a) {
        if (!D[l.Kc].c[a]) return !1;
        l.Hh(a);
        g.Qg();
        g.pd();
        q.pd();
        l.Id(!0);
        l.log("layer", a);
        return !0
    };
    l.ej = function(a) {
        l.Kc = a;
        D[a].c[l.g] || l.Hh("temperature");
        l.setTime(l.j);
        g.Qg();
        g.c.update();
        g.pd()
    };
    l.ve = function(a) {
        l.setTime(a);
        g.c.update();
        q.pd();
        e.pd();
        p.Vf();
        l.Id();
        l.log("time", l.j.format("dd.MM.yyyy HH:mm"))
    };
    l.vd = function(a) {
        t.mf && (t.mf.checked = "off" != a);
        l.jj(a);
        l.Id();
        l.log("wind", a)
    };
    l.Ug = function(a) {
        var b = l.Ed();
        "auto" == l.Kc && g.Wc.model.Dg("");
        l.ej(a);
        b != l.Ed() ? (q.pd(), e.pd()) : "auto" == l.Kc && g.Wc.model.Dg(D[l.Ed()].Zf);
        l.Id();
        l.log("model", l.Kc)
    };
    l.units = {};
    l.Vg = function(a, b) {
        l.units[a] = b;
        d.Fh("units", JSON.stringify(l.units));
        p.Vf();
        q.N && q.N.o == a && (l.ae && q.jd(), q.Kf())
    };
    l.Id = function(a) {
        t.Sh();
        if (!z.ug) {
            var b = l.Fg();
            b.od = l.Kc;
            b.gd = l.g;
            b.time = l.j;
            b.zf = l.kd;
            a ? history.pushState(b, "VentuSky", ja.ai(b)) : history.replaceState(b, "VentuSky", ja.ai(b))
        }
    };
    history.pushState ||
        (l.Id = function() {});
    A.addEventListener("popstate", function(a) {
        (a = a.state) && a.detail ? z.Se(a.detail, a.title, a.sl) : (a && a.lat && a.lon && a.zoom || (a = ja.parse(location.href)), a && a.lat && a.lon && a.zoom && (l.gj(a), z.close(), q.pd()))
    }, !1);
    l.gj = function(a) {
        if (a.gd || a.time) a.gd && D.auto.c[a.gd] && l.Hh(a.gd), a.time && D.auto.Xc[+a.time] && l.setTime(a.time), l.ej(a.od || "auto"), g.Wc.model.Od(a.od), "auto" == l.Kc && g.Wc.model.Dg(D[l.Ed()].Zf);
        "undefined" != typeof a.zf && l.jj(a.zf);
        g.c.update();
        a.lat && a.lon && l.nf(a.lat, a.lon, "zoom" in
            a ? a.zoom : 3)
    };
    var P = I.zoom,
        L = K = 0,
        F = 1,
        Aa = 1,
        xa = 1,
        sa = 0;
    l.resize = function(a) {
        if (!a) var b = l.Fg();
        H = k.ceil(A.innerWidth * F);
        J = k.ceil(A.innerHeight * F);
        p.resize();
        q.resize(!0);
        e.resize();
        t.resize();
        a || l.nf(b.lat, b.lon, b.zoom)
    };
    l.Gk = function(a) {
        try {
            var b = JSON.parse(a)
        } catch (f) {}
        for (var c in b) ea[c] && ea[c][b[c]] && (l.units[c] = b[c])
    };
    l.log = function() {};
    l.Oi = function() {};
    l.Tc = function() {
        function a(a) {
            var b = k.max(A.innerWidth, A.innerHeight);
            xa = 1920 < b ? 1920 / b : 1;
            Aa = A.devicePixelRatio || A.xl || A.Af || 1;
            sa = k.max(k.min(320 /
                A.innerWidth, .8), .4);
            F = k.max(k.min(xa * (d.Qe("dpr") || 1), Aa), sa);
            l.resize(a)
        }

        function b() {
            l.loop();
            requestAnimationFrame(b)
        }
        if (A.ga) {
            l.log = function(a, b) {
                A.ga("send", "event", a, b)
            };
            var c = location.href.replace(/[?#].*/, "").replace(/\/[^\/]*$/, "/");
            l.Oi = function(a) {
                A.ga("set", "page", c + a);
                A.ga("send", "pageview")
            }
        }
        l.Pk();
        q.wk();
        var f = d.ng("units"),
            v = d.Qe("grid");
        l.ae = v ? "1" == v : pa;
        p.ld = wa[d.Qe("borders")] || "";
        (function() {
            for (var a in ea)
                for (var b in ea[a]) l.units[a] && 1 != ea[a][b].Oc || (l.units[a] = b)
        })(ea);
        g.Tc();
        g.translate(n.code);
        l.Gk(f);
        q.fj("temperature");
        p.Tc();
        a(!0);
        z.Rj() ? g.c.update() : (f = l.Ek() || I, v = ja.parse(location.href), l.gj(v), v.lat && v.lon || l.nf(f.lat, f.lon, f.zoom));
        e.Tc();
        q.Tc();
        requestAnimationFrame(b);
        var y;
        A.addEventListener("resize", function() {
            clearTimeout(y);
            y = setTimeout(a, 250)
        }, !1)
    };
    A.addEventListener("load", l.Tc, !1);
    var Z = {
        gg: function(a, b, c, f, d, k) {
            var h = c.length;
            a = (d ? [this.Pj, this.Tg, this.hi, this.Sg][d - 1] : .25 < (c[h - 1] - c[0]) / h ? this.Tg : this.Sg).call(this, a, b, c, f, h);
            k(a)
        },
        Pj: function(a, b, c,
            f, d) {
            for (var k = new Int32Array(d), h = new Float64Array(d), e = 0; e < d; e++) k[e] = c[e] | 0, h[e] = c[e] % 1;
            c = new Int32Array(d * d);
            for (var l = e = 0; l < d; l++)
                for (var g = (f[l] | 0) * b, n = f[l] % 1, m = 0; m < d; m++) {
                    var p = g + k[m];
                    c[e++] = .5 > h[m] ? .5 > n ? a[p] : a[p + b] : .5 > n ? a[p + 1] : a[p + b + 1]
                }
            return c
        },
        Sg: function(a, b, c, f, d) {
            for (var k = new Int32Array(d), h = new Float64Array(d), e = new Float64Array(d), l = new Float64Array(d), g = 0; g < d; g++) k[g] = (c[g] | 0) - 1, h[g] = c[g] % 1, e[g] = h[g] * h[g], l[g] = e[g] * h[g];
            c = new Int32Array(d * d);
            for (var n = g = 0; n < d; n++)
                for (var m = ((f[n] |
                        0) - 1) * b, p = f[n] % 1, q = p * p, t = q * p, r = 0; r < d; r++) {
                    var w = m + k[r],
                        u = this.Gj(h[r], e[r], l[r], p, q, t, a[w], a[w + 1], a[w + 2], a[w + 3], a[w += b], a[w + 1], a[w + 2], a[w + 3], a[w += b], a[w + 1], a[w + 2], a[w + 3], a[w += b], a[w + 1], a[w + 2], a[w + 3]);
                    c[g++] = u
                }
            return c
        },
        Oj: function(a, b, c, f, d) {
            for (var k = "undefined" == typeof Float64Array ? Array : Float64Array, h = "undefined" == typeof Int32Array ? Array : Int32Array, e = d / 2, l = new h(e), k = new k(e), g = 0; g < e; g++) l[g] = c[2 * g] | 0, k[g] = c[2 * g] % 1;
            c = new h(d * d);
            for (h = g = 0; h < e; h++) {
                for (var n = (f[2 * h] | 0) * b, m = f[2 * h] % 1, p = 0; p < e; p++) {
                    var q =
                        n + l[p],
                        t = this.te(k[p], m, a[q], a[q + 1], a[q += b], a[q + 1]);
                    c[g] = c[g + 1] = c[g + d] = c[g + d + 1] = t;
                    g += 2
                }
                g += d
            }
            return c
        },
        Tg: function(a, b, c, f, d) {
            for (var k = new Int32Array(d), h = new Float64Array(d), e = 0; e < d; e++) k[e] = c[e] | 0, h[e] = c[e] % 1;
            c = new Int32Array(d * d);
            for (var g = e = 0; g < d; g++)
                for (var l = (f[g] | 0) * b, n = f[g] % 1, m = 0; m < d; m++) {
                    var p = l + k[m];
                    c[e++] = this.te(h[m], n, a[p], a[p + 1], a[p += b], a[p + 1])
                }
            return c
        },
        te: function(a, b, c, f, d, k) {
            c = (f - c) * a + c;
            return ((k - d) * a + d - c) * b + c
        },
        Hj: function(a, b, c, f, d, e, h) {
            return k.atan2(Z.te(a, b, k.sin(c * h), k.sin(f *
                h), k.sin(d * h), k.sin(e * h)), Z.te(a, b, k.cos(c * h), k.cos(f * h), k.cos(d * h), k.cos(e * h))) / h
        },
        hi: function(a, b, c, f, d) {
            for (var e = new Int32Array(d), h = new Float64Array(d), g = new Float64Array(d), l = new Float64Array(d), n = 0; n < d; n++) {
                var m = k.round(c[n]);
                e[n] = m - 1;
                var m = c[n] - m,
                    p = m * m,
                    q = p * p;
                h[n] = 4 * q - 3 * p + 1;
                g[n] = (-4 * q + 3 * p - m) / 2;
                l[n] = (-4 * q + 3 * p + m) / 2
            }
            c = new Int32Array(d * d);
            for (m = n = 0; m < d; m++)
                for (var q = k.round(f[m]), p = (q - 1) * b, x = f[m] - q, t = x * x, r = t * t, q = 4 * r - 3 * t + 1, w = (-4 * r + 3 * t - x) / 2, x = (-4 * r + 3 * t + x) / 2, t = 0; t < d; t++) r = p + e[t], c[n++] = this.pk(h[t],
                    g[t], l[t], q, w, x, a[r], a[r + 1], a[r + 2], a[r += b], a[r + 1], a[r + 2], a[r += b], a[r + 1], a[r + 2]);
            return c
        },
        pk: function(a, b, c, f, d, k, h, e, g, l, n, m, p, q, t) {
            return (n * a + l * b + m * c) * f + (e * a + h * b + g * c) * d + (q * a + p * b + t * c) * k
        },
        Gj: function(a, b, c, f, d, k, h, e, g, l, n, m, p, q, t, r, w, u, z, B, S, T) {
            if (h == T && z == l && h == l && e == S && B == g && n == u && q == t && e == n && g == t && e == g && h == e && m == w && p == r && m == p && m == h) return h;
            l = l - g - h + e;
            q = q - p - n + m;
            u = u - w - t + r;
            T = T - S - z + B;
            h = l * c + (h - e - l) * b + (g - h) * a + e;
            n = q * c + (n - m - q) * b + (p - n) * a + m;
            t = u * c + (t - r - u) * b + (w - t) * a + r;
            a = T * c + (z - B - T) * b + (S - z) * a + B - t - h + n;
            return a *
                k + (h - n - a) * d + (t - h) * f + n
        },
        Al: function(a, b, c, f, d, e, h, g, l, n, m, p, q, t, r, u, w) {
            a = -Infinity;
            b = Infinity;
            b = k.max(p, q, u, w);
            a = k.min(p, q, u, w);
            return b - a
        }
    };
    if (!A.Worker || A.opera) Z.Tg = Z.Sg = Z.hi = Z.Oj;
    var ua = Ia / 256,
        $a = Ja * ua * ua,
        E = {
            Oe: {},
            mg: [],
            Ld: {
                "null": {
                    request: 0
                }
            },
            me: [],
            Hi: {},
            hg: [],
            wj: [],
            Tc: function() {
                for (var a = 0; a < Ja; a++) {
                    var b = d.a("canvas");
                    b.width = b.height = Ia;
                    b = b.getContext("2d");
                    E.wj.push(b)
                }
                E.xj = b.getImageData(0, 0, 256, 256)
            },
            Nk: function(a) {
                var b = Infinity,
                    c = E.hg.indexOf(a);
                if (-1 == c) {
                    for (var f = 0; f < $a; f++) {
                        var d =
                            E.Ld[E.hg[f]],
                            d = d ? d.request : 0;
                        d < b && (c = f, b = d)
                    }
                    if (d = E.Ld[E.hg[c]]) d.position = -1, d.ud = null;
                    E.hg[c] = a
                }
                return {
                    index: c,
                    context: E.wj[c / ua / ua | 0],
                    x: c % ua * 256,
                    y: (c / ua | 0) % ua * 256
                }
            },
            Ai: function(a, b, c) {
                var f = E.Nk(a);
                E.Ld[a].position = f.index;
                E.Ld[a].ud = {
                    canvas: f.context.canvas,
                    x: f.x,
                    y: f.y
                };
                f.context.putImageData(E.ek(b, c), f.x, f.y)
            },
            Tj: function(a) {
                return k.round(a)
            },
            Sj: function(a) {
                return k.random() < a % 1 ? k.ceil(a) : k.floor(a)
            },
            kk: function(a, b) {
                var c = E.Ld[E.Hi[b]];
                if (c) return c.ud;
                for (c = 0; 5 > c; c++);
            },
            ek: function(a, b) {
                for (var c =
                        E.xj.data, f = b.Zc ? E.Sj : E.Tj, d = a.length - 1; 0 <= d; d--) {
                    var e = b.kg[f((k.min(k.max(a[d], b.min), b.max) - b.min) / b.step)] || [];
                    c[4 * d + 0] = e[0];
                    c[4 * d + 1] = e[1];
                    c[4 * d + 2] = e[2];
                    c[4 * d + 3] = e[3]
                }
                return E.xj
            },
            request: 0,
            hh: function(a, b, c, f, d) {
                a = fa(a, 2 * (1 << c));
                var e = [c, a, b].join("/"),
                    h = [e, f.od, f.gd, +f.time].join("/"),
                    k = E.Ld[h];
                if (k) return k.request = ++E.request, 2 == k.status ? -1 == k.position && E.Ai(h, k.values, u[f.gd]) : k.status = 1, E.Hi[e] = h, k;
                e = E.kk(h, e, a, b, c, f);
                if (!d) return e ? {
                    ud: e
                } : {};
                E.Ld[h] = k = {};
                k.request = ++E.request;
                k.status =
                    0;
                E.me.push(h);
                if (E.me.length > Pa) {
                    E.me.sort(function(a, b) {
                        return E.Ld[a].request - E.Ld[b].request
                    });
                    var g = E.Ld[E.me[0]];
                    g.values = null;
                    delete E.Ld[E.me[0]];
                    E.me.shift();
                    g = null
                }
                var l;
                E.mk(a, b, c, f, function(a, b, c, e) {
                    k.status = 1;
                    E.yk.gg(a, b, c, e, function(a, b) {
                        k.values = a;
                        k.status = 2;
                        k.position = -1;
                        k.ud = null;
                        b && E.Ai(h, a, u[f.gd]);
                        l && d()
                    })
                });
                l = !0;
                return !k.ud && e ? {
                    ud: e
                } : k
            },
            mk: function(a, b, c, f, e) {
                function g() {
                    for (var c = new Float64Array(256), f = new Float64Array(256), d = 0; 256 > d; d++) f[d] = l.xf((256 * b + d) / B) * p - q - ha, c[d] =
                        (256 * a + d) / B * m - t - w;
                    e(ra, S, c, f)
                }
                var h = D[f.od].Kd[f.gd].size || D[f.od].size;
                if (5 > c) var n = Da,
                    m = Da.width,
                    p = Da.height;
                else n = Ua, m = h.width, p = h.height;
                var q = 0,
                    t = 0,
                    r = !0,
                    x = k.ceil(m / n.width),
                    z = k.ceil(p / n.height);
                h.kf && (p *= 180 / (h.kf - h.Ji), q = p * (90 - h.kf) / 180);
                h.Ik && (m *= 360 / (h.Ik - h.Jk), t = m * (180 + h.Jk) / 360, r = !1);
                var B = 512 * (1 << c),
                    h = B / 256;
                if (!0 === D[f.od].Kd[f.gd].Sd || D[f.od].Sd) a = fa(a + h / 2, 2 * (1 << c));
                var w = k.floor(a / h * m - t - 1),
                    V = k.ceil((a + 1) / h * m - t + 2),
                    ha = k.floor(l.xf(b / h) * p - q - 1),
                    oa = k.ceil(l.xf((b + 1) / h) * p - q + 2),
                    S = V - w,
                    T = oa -
                    ha,
                    N = S * T;
                c = 0;
                var h = 1,
                    na = 0,
                    ga = 1;
                1 != x && (r ? (c = k.floor(fa(w, m) / n.width), h = k.ceil(fa(V, m) / n.width), c > h && (h += x)) : (c = k.max(k.floor(w / n.width), 0), h = k.min(k.ceil(V / n.width), x)));
                1 != z && (na = k.max(k.floor(ha / n.height), 0), ga = k.min(k.ceil(oa / n.height), z));
                var A = (h - c) * (ga - na),
                    C = u[f.gd].A || function(a) {
                        return a
                    };
                0 >= A && (setTimeout(g, 1), S = T = N = 1);
                for (var ra = new Int32Array(N), F = U[f.gd].file, Q = f.od + (U[f.gd].wd || ""), r = na; r < ga; r++)
                    for (V = c; V < h; V++)(function(a, b) {
                        function c(f) {
                            for (var d = a * n.width, h = b * n.height, e = k.min((a + 1) *
                                    n.width, m), l = k.min((b + 1) * n.height, ha + T), v = a == x - 1 ? -1 : 0, p = 0 == a ? 2 : 1, q = k.max(h, ha); q < l; q++)
                                for (var t = (q - ha) * S, r = (q - h) * n.width, G = v; G < p; G++)
                                    for (var u = d + m * G, Q = k.min(e + m * G, w + S), z = k.max(u, w); z < Q; z++) ra[t + (z - w)] = f[r + z - u];
                            --A || g()
                        }
                        var h = {
                                model: Q,
                                layer: F,
                                time: f.time,
                                tileX: a,
                                tileY: b,
                                cache: String(D[f.od].end).replace(/0+$/, "")
                            },
                            h = d.Pc(n.path, h);
                        if (E.Oe[h]) E.Oe[h].data ? c(E.Oe[h].data) : E.Oe[h].cf.push(c);
                        else {
                            var e = {
                                cf: [c]
                            };
                            E.Oe[h] = e;
                            E.mg.push(h);
                            if (36 < E.mg.length) {
                                var l = E.mg[0];
                                E.Oe[l].cf.length = 0;
                                delete E.Oe[l];
                                E.mg.shift()
                            }
                            Array.isArray(h) ? d.zi(h, function(a) {
                                for (var b = a.length, c = [], f = new Int32Array(a[0].length), d = 0; d < a[0].length; d++) {
                                    for (var h = 0; h < b; h++) c[h] = a[h][d];
                                    f[d] = 1E3 * C.apply(this, c)
                                }
                                e.data = f;
                                for (d = 0; d < e.cf.length; d++) e.cf[d](f)
                            }) : d.yi(h, function(a) {
                                for (var b = new Int32Array(a.length), c = 0; c < a.length; c++) b[c] = 1E3 * C(a[c]);
                                e.data = b;
                                for (c = 0; c < e.cf.length; c++) e.cf[c](b)
                            })
                        }
                    })(V % x, r % z)
            }
        };
    Y.prototype.vl = function(a) {
        return function(b) {
            var c = b.data.xk;
            a.gg(new Int32Array(c.source), c.Zk, new Float64Array(c.x),
                new Float64Array(c.y), c.type,
                function(a) {
                    postMessage({
                        rg: b.data.rg,
                        jl: a.buffer
                    }, [a.buffer])
                })
        }
    };
    Y.type = 0;
    Y.Pf = 0;
    Y.prototype.onmessage = function(a) {
        var b = -1 < a.data.rg && this.Gi[a.data.rg];
        b && b.ge(new Int32Array(a.data.jl))
    };
    Y.prototype.gg = function(a, b, c, d, e) {
        for (var k = !0, h = 0; h < a.length; h++)
            if (a[h]) {
                k = !1;
                break
            }
        if (k) e(new Int32Array(c.length * c.length), !0);
        else {
            if (this.Wh) return ++Y.Pf, a = {
                    source: a.buffer,
                    Zk: b,
                    x: c.buffer,
                    y: d.buffer,
                    type: Y.type
                }, this.Wh[this.vg].postMessage({
                    xk: a,
                    rg: Y.Pf
                }, [a.source, a.x, a.y]),
                this.Gi[Y.Pf] = {
                    ge: e,
                    Nl: this.vg
                }, this.vg = (this.vg + 1) % this.vj, Y.Pf;
            Z.gg(a, b, c, d, Y.type, function(a) {
                e(a, !0)
            })
        }
    };
    E.yk = new Y;
    g.Zd[73] = function() {
        Y.type = Y.type ? 0 : 1;
        g.Je(n.We, [n.K, n.J][Y.type]);
        for (var a = 0; a < E.me.length; a++) delete E.Ld[E.me[a]];
        E.me.length = 0;
        setTimeout(function() {
            q.jd(!0)
        }, 100)
    };
    var R = {
            bi: function(a, b, c, d) {
                var e = [qa.replace(/\/$/, "")],
                    k = ["/?", "&", "&", "&"];
                if (a || b || c || d) {
                    if (a) {
                        var h = 2 < a.zoom ? 5 < a.zoom ? 8 < a.zoom ? 3 : 2 : 1 : 0;
                        e.push(k.shift() + "p=" + a.lat.toFixed(h) + ";" + a.lon.toFixed(h) + ";" + a.zoom)
                    }
                    b &&
                        e.push(k.shift() + "l=" + l.g + (l.$i && l.$i != ALTITUDES[0] ? "/" + l.$i : ""));
                    c && e.push(k.shift() + "t=" + l.j.format("yyyyMMdd/HH"));
                    b && "auto" != l.Kc && e.push("&m=" + l.Kc);
                    d && "normal" != l.kd && e.push(k.shift() + "w=" + l.kd)
                }
                return e.join("")
            },
            Pg: function(a, b, c, f, e, k) {
                var h = [];
                f.trim() && h.push(f);
                b && (U[l.g].pg ? h.push(d.Pc(n.kj[U[l.g].pg] || "{sublayer}", {
                    group: n.c[U[l.g].group],
                    sublayer: g.gh(l.g)
                })) : h.push(n.c[l.g]));
                a && h.push(d.coords(a, 6 < a.zoom));
                c && h.push((new Date(l.j - 6E4 * g.Sb)).format(n.s + " " + n.sd) + " (" + d.timeZone(g.Sb,
                    g.mj) + ")");
                return {
                    info: h,
                    i: e,
                    Gd: k
                }
            },
            Uj: function(a) {
                var b = "";
                6 < a.zoom ? b = "-" + k.floor(k.abs(a.lat)) + String(k.round(k.abs(a.lat) % 1 * 60)).Ad(2, "0") + (0 > a.lat ? "s" : "n") + k.floor(k.abs(a.lon)) + String(k.round(k.abs(a.lon) % 1 * 60)).Ad(2, "0") + (0 > a.lon ? "w" : "e") : 3 < a.zoom && (b = "-" + k.round(k.abs(a.lat)) + (0 > a.lat ? "s" : "n") + k.round(k.abs(a.lon)) + (0 > a.lon ? "w" : "e"));
                return "ventusky-" + l.g + "-" + l.j.format("yyyyMMdd") + "t" + l.j.format("HHmm") + b
            },
            Zg: function(a, b, c, d, k) {
                a.fillStyle = "#555";
                a.fillRect(0, 0, d, k);
                q.N.Nd || a.drawImage(p.je,
                    b, c, d, k, 0, 0, d, k);
                e.b.Ve || (a.globalAlpha = q.N.opacity, a.drawImage(q.Sc, b, c, d, k, 0, 0, d, k), a.globalAlpha = 1, (p.ld || q.ld || "#FFF") == e.b.color && a.drawImage(p.ee, b, c, d, k, 0, 0, d, k))
            },
            Kf: function(a, b, c) {
                var d = 12.8,
                    e = k.round(1.5 * d),
                    g = e * q.Fd.length;
                g + e > c && (d = k.round(d * c / g * 100) / 100, e = c / q.Fd.length, g = e * q.Fd.length);
                a.font = d + "px v, Segoe UI, sans-serif";
                for (var h = d / 2, l = [], n = 0; n < q.Fd.length; n++) {
                    var m = q.Fd[n];
                    a.font = d + "px " + (m.yf ? "i" : "v") + ", Segoe UI, sans-serif";
                    l[n] = a.measureText(m.text).width
                }
                h = k.round(k.max.apply(k,
                    l) + h);
                b = b - h;
                c = c - g;
                3 > c && (a.fillStyle = "#FFF", a.fillRect(b, 0, h, c));
                n = a.createLinearGradient(b, 0, b + h, 0);
                n.addColorStop(0, "#555");
                n.addColorStop(.5, "#999");
                n.addColorStop(1, "#555");
                a.fillStyle = n;
                a.fillRect(b, c, h, g);
                for (n = 0; n < q.Fd.length; n++) m = q.Fd[n], a.font = d + "px " + (m.yf ? "i" : "v") + ", Segoe UI, sans-serif", a.fillStyle = m.yf ? "#FFF" : m.ci, a.fillRect(b, k.round(n * e + c), h, k.ceil(e)), a.fillStyle = m.yf ? "#000" : m.lj, a.fillText(m.text, b + k.round((h - l[n]) / 2), (n + .92) * e + c);
                return h
            },
            $g: function(a, b, c, d, g, l) {
                e.b.Ve && (a.globalAlpha =
                    q.N.opacity, a.drawImage(q.Sc, b, c, d, g, 0, 0, d, g), a.globalAlpha = 1);
                q.N.Nd && a.drawImage(p.je, b, c, d, g, 0, 0, d, g);
                ((p.ld || q.ld || "#FFF") != e.b.color || e.b.Ve || q.N.Nd) && a.drawImage(p.ee, b, c, d, g, 0, 0, d, g);
                a.strokeStyle = a.fillStyle = "#0A2941";
                a.textBaseline = "bottom";
                for (var h = 0; h < p.he.length; h++) {
                    var n = p.he[h];
                    if (!(n.Jd || n.x < b || n.y < c || n.x > b + d || n.y > c + g)) {
                        var m = [1, 1, 1, 2, 2][n.size - 1],
                            t = [2, 3, 4, 5, 6][n.size - 1] - m / 2,
                            r = [3, 4, 5, 6, 7][n.size - 1];
                        a.lineWidth = m;
                        a.beginPath();
                        a.arc(k.round(n.x - b), k.round(n.y - c), t, 0, 2 * k.PI, !1);
                        a.stroke();
                        a.font = "14px " + (4 > n.size ? "i" : "v") + ", Segoe UI, sans-serif";
                        for (var m = n.name.split("\r\n"), u = m.length - 1; 0 <= u; u--) t = a.measureText(m[u]).width, a.fillText(m[u], k.round(n.x - b - t / 2), k.round(n.y - c - r)), r += 17.5
                    }
                }
                h = d;
                l.i && (h -= R.Kf(a, d, g));
                a.shadowOffsetX = a.shadowOffsetY = 1.5;
                a.shadowBlur = 3;
                a.shadowColor = "rgba(0,0,0,0.5)";
                l.Gd && (m = k.min(.3 * d / R.Gd.width, .15 * g / R.Gd.height, 1), a.drawImage(R.Gd, h - R.Gd.width * m - 5, g - R.Gd.height * m - 5, R.Gd.width * m, R.Gd.height * m), h -= R.Gd.width * m + 10);
                if (l.info.length)
                    if (d = 14, a.font = d + "px v, Segoe UI, sans-serif",
                        a.fillStyle = "#FFF", g = g - 5 + 3, b = h - 10, h = l.info.join(", "), a.measureText(h).width > b) {
                        c = [];
                        for (h = 0; h < l.info.length; h++) c[h] = a.measureText(l.info[h]).width;
                        m = k.max.apply(k, c);
                        if (m > b) {
                            d = k.round(14 * b / m * 100) / 100;
                            a.font = d + "px v, Segoe UI, sans-serif";
                            for (h = 0; h < l.info.length; h++) c[h] = a.measureText(l.info[h]).width;
                            g = g - 3 + 3 * b / m
                        }
                        n = a.measureText(", ").width;
                        m = [];
                        t = 0;
                        r = "";
                        for (h = l.info.length - 1; 0 <= h; h--) t && t + c[h] + n > b && (m.push(r), r = "", t = 0), r = l.info[h] + (r ? ", " + r : ""), t += c[h] + n;
                        m.push(r);
                        for (h = 0; h < m.length; h++) a.fillText(m[h],
                            5, g), g -= 1.25 * d
                    } else a.fillText(h, 5, g);
                a.shadowOffsetX = a.shadowOffsetY = a.shadowBlur = 0;
                a.shadowColor = "transparent"
            },
            Vj: function(a, b, c, f, k, g, h) {
                var l = d.a("canvas", {
                        width: c,
                        height: f
                    }),
                    n = l.getContext("2d");
                R.Zg(n, a, b, c, f);
                n.globalAlpha = e.b.opacity;
                n.drawImage(e.Sc, a, b, c, f, 0, 0, c, f);
                n.globalAlpha = 1;
                R.$g(n, a, b, c, f, h);
                return l.toDataURL(k, g)
            },
            Wk: function(a, b) {
                if ("download" in HTMLAnchorElement.prototype) {
                    var c = d.a("a", {
                        href: a,
                        download: b,
                        parent: B.body
                    });
                    c.click();
                    c.parentNode.removeChild(c)
                } else {
                    if (!pa) try {
                        for (var c =
                                atob(a.split(",")[1]), f = new ArrayBuffer(c.length), e = new Uint8Array(f), k = 0; k < c.length; k++) e[k] = c.charCodeAt(k) & 255;
                        try {
                            var h = new Blob([f], {
                                type: "application/octet-stream"
                            })
                        } catch (g) {
                            var l = new(A.WebKitBlobBuilder || A.MozBlobBuilder);
                            l.append(f);
                            h = l.getBlob("application/octet-stream")
                        }
                        h.name = b;
                        navigator.msSaveOrOpenBlob ? navigator.msSaveOrOpenBlob(h, b) : location.href = (A.webkitURL || A.URL).createObjectURL(h);
                        return
                    } catch (g) {}
                    c = A.open("about:blank", "_blank");
                    c.document.write('<img src="' + a + '" style="position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;box-shadow:0 0 0 20px,0 0 0 2000px #222;max-width:100%;max-height:100%">');
                    c.document.close()
                }
            },
            $j: function(a, b, c, f) {
                var g = 512 * (1 << P),
                    n = (K + a) / g * e.qe,
                    h = (K + a + c) / g * e.qe + 1;
                c = l.xf((L + b) / g) * e.Ud;
                var m = l.xf((L + b + f) / g) * e.Ud + 1;
                f = k.floor(h) - k.floor(n) + 1;
                for (var p = k.floor(m) - k.floor(c) + 1, q = d.a("canvas", {
                        width: f,
                        height: p
                    }), t = q.getContext("2d"), r = t.getImageData(0, 0, f, p), u = r.data, x = 0, z = k.floor(c); z < k.floor(m) + 1; z++)
                    for (var B = k.floor(n); B < k.floor(h) + 1; B++) {
                        var w = z * e.qe + B % e.qe;
                        u[x + 0] = 255;
                        u[x + 1] = e.Uh[w];
                        u[x + 2] = e.Vh[w];
                        u[x + 3] = 255;
                        x += 4
                    }
                t.putImageData(r, 0, 0);
                h = q.toDataURL("image/jpeg", .9);
                q = q.toDataURL("image/png");
                h = .9 * q.length > h.length ? h : q;
                return {
                    df: a + K - k.floor(n) * g / e.qe,
                    Lf: b + L - l.eh(k.floor(c) * e.Ud) / e.Ud,
                    Mk: 1 / g * 2 * k.PI,
                    wl: k.floor(c),
                    $e: ((b + L) / g * 2 - 1) * k.PI,
                    tl: e.qe / g,
                    Ml: g,
                    di: h,
                    width: f,
                    height: p
                }
            },
            Xj: function(a, b, c, f, g, l) {
                function h(a) {
                    return 'style="' + a.join("!important;").replace(/:\s/g, ":") + '!important"'
                }
                if ("wave" == Ea[e.h].kind) return "\x3c!-- " + n.fa + " - " + n.Ke + " --\x3e";
                var m = 'width="' + c + '" height="' + f + '"',
                    p = ' alt="' + d.Wf((l.Gd ? l.info.concat("\u00a9 VentuSky.com") : l.info).join(", "), !0) + '"',
                    q = ["max-width: " + c + "px", "width: 100%", "display: inline-block"],
                    t = l.info.length ? ' title="' + d.Wf(l.info.join(", "), !0) + '"' : "",
                    r = d.a("canvas", {
                        width: c,
                        height: f
                    }),
                    u = r.getContext("2d");
                if (e.b.sh) R.Zg(u, a, b, c, f), R.$g(u, a, b, c, f, l), c = p = "<img " + m + p + ' src="' + r.toDataURL("image/jpeg", .9) + '" ' + h(["display: block", "width: 100%", "height: auto", "border: 0"]) + ">";
                else {
                    R.$g(u, a, b, c, f, l);
                    l = r.toDataURL("image/png");
                    R.Zg(u, a, b, c, f);
                    for (var r = r.toDataURL("image/jpeg", .9), u = k.round(k.min(k.max(c, f) / 25, da)), x = k.round(c *
                            f / H / J * e.b.Hd), z = [], B = 0; B < e.b.pe.length; B++) z.push(k.round(x / e.b.pe.length * B) + ":" + e.b.pe[B]);
                    var w = {};
                    w["@i"] = c;
                    w["@v"] = f;
                    w["@m"] = e.b.Wd;
                    w["@k"] = x;
                    w["@d"] = c + 2 * u;
                    w["@p"] = f + 2 * u;
                    w["@r"] = u;
                    w["@l"] = e.b.xi;
                    w["@h"] = e.b.Jf;
                    w["@z"] = '"' + (e.b.color || "#FFF") + '"';
                    w["@x"] = "{" + z.join(",") + "}";
                    w["@b"] = e.b.length;
                    w["@g"] = Z.te.toString();
                    w["@s"] = .2;
                    a = R.$j(a - u, b - u, c + 2 * u, f + 2 * u);
                    w["@c"] = a.di;
                    w["@u"] = a.width;
                    w["@q"] = a.height;
                    w["@t"] = a.tl;
                    w["@w"] = a.wl;
                    w["@e"] = a.df;
                    w["@j"] = a.Mk;
                    w["@f"] = a.$e;
                    w["@y"] = 2 * e.Ud / k.PI;
                    w["@o"] = a.width *
                        a.height;
                    b = (Na.Ck.toString() + ".call(parentNode,window,document,Math,Date," + Na.Dk.toString()).replace(/\$\["([^"]+)"\]/g, function(a, b) {
                        return w[b]
                    }).replace(/"/g, "'").replace(/(function)\s\(/g, "$1(").replace(/([|>*+,;=])\r?\n/g, "$1").replace(/([|>*+,=&])\r?\n/g, "$1");
                    var V = {},
                        ha = 0;
                    b = b.replace(/([^a-z0-9])([a-z])(?=[^a-z0-9])/gi, function(a, b, c) {
                        if (a = "mojzik".charAt(ha++)) V[c] = a, V[a] ? V[V[a]] = c : V[a] = c;
                        else {
                            if (V[c]) return b + V[c];
                            V[c] = c
                        }
                        return b + V[c]
                    });
                    b += ",'" + a.di + "')";
                    p = "<img " + m + p + ' src="' + l + '" ' + h("display: block;position: absolute;left: 0;top: 0;width: 100%;height: 100%;z-index: 2;margin: 0;border: 0;padding: 0".split(";")) +
                        ' onload="onload=' + d.Wf(b, !0) + ',null">';
                    p = "<canvas " + m + " " + h(["left: 0", "top: 0", "width: 100%", "height: 100%", "position: absolute", "z-index: 1", "opacity: " + e.b.opacity]) + ">" + d.Wf(n.I) + "</canvas>" + p;
                    c = "<span " + h(["height: 0", "width: 100%", "display: block", "box-sizing: content-box", "padding: 0 0 " + k.round(f / c * 1E5) / 1E3 + "% 0", "position: relative"]) + ">" + p + "</span>";
                    q.push("background: url(" + r + ") no-repeat", "background-size: contain")
                }
                return '<a target="_top"' + t + " " + h(q) + ' href="' + d.Wf(g, !0) + '">' + c + "</a>"
            }
        },
        Na = {
            Dk: function(a, b, c, d) {
                function e(a, c) {
                    a.x = b.random() * $["@d"];
                    a.y = b.random() * $["@p"];
                    a.Rc = c + b.random() * $["@l"];
                    return a
                }
                var k = $["@g"];
                c.strokeStyle = $["@z"];
                c.translate(-$["@r"], -$["@r"]);
                for (var h = [], g = h.length; g < $["@k"]; g++) h.push(e({}, 0));
                var l = $["@x"],
                    n = new(a.Int8Array || Array)($["@o"]),
                    m = new(a.Int8Array || Array)($["@o"]),
                    p;
                (function() {
                    var b = a.document.createElement("canvas");
                    b.width = $["@u"];
                    b.height = $["@q"];
                    var c = b.getContext("2d"),
                        h = new Image;
                    h.src = d;
                    h.onload = function() {
                        c.drawImage(h, 0, 0);
                        for (var a = c.getImageData(0, 0, $["@u"], $["@q"]).data, d = 0; d < $["@o"]; d++) n[d] = a[4 * d + 1] - 127, m[d] = a[4 * d + 2] - 127;
                        p = !0;
                        c = b = h.onload = null
                    }
                })();
                for (var q = [], t = [], r = [], u = [], g = 0; g < $["@d"]; g++) {
                    var w = (g + $["@e"]) * $["@t"];
                    q[g] = w | 0;
                    r[g] = w % 1
                }
                for (g = 0; g < $["@p"]; g++) w = b.atan(b.exp(g * $["@j"] + $["@f"])) * $["@y"] - $["@w"], t[g] = (w | 0) * $["@u"], u[g] = w % 1;
                return function(a) {
                    if (p) {
                        var d = $["@u"],
                            f = $["@b"] * a;
                        c.lineWidth = l[0];
                        for (var g = 0; g < $["@k"]; g++) {
                            var w = h[g];
                            0 >= w.Rc && e(w, $["@h"]);
                            var z = b.round(w.x),
                                B = b.round(w.y),
                                M = q[z],
                                A = t[B],
                                z = r[z],
                                C = u[B],
                                B = k(z, C, n[A + M], n[A + M + 1], n[A + d + M], n[A + d + M + 1]) * f,
                                M = k(z, C, m[A + M], m[A + M + 1], m[A + d + M], m[A + d + M + 1]) * f;
                            c.moveTo(w.x, w.y);
                            w.x += B;
                            w.y -= M;
                            c.lineTo(w.x, w.y);
                            g in l && (c.stroke(), c.beginPath(), c.lineWidth = l[g]);
                            w.Rc -= a;
                            if (0 > w.x || w.x >= $["@d"] || 0 > w.y || w.y >= $["@p"]) w.Rc = 0
                        }
                        c.stroke()
                    }
                }
            },
            Ck: function(a, b, c, d, e, k) {
                function h() {
                    var e = d.now(),
                        k = 500 < e - t ? 1 : c.min((e - t) / 16, 10);
                    t = e;
                    if (500 < e - r && (r = t, (e = b.getElementById("ventusky")) && !e.checked ? u = !1 : (e = g.getBoundingClientRect(), u = c.max(0, c.min(e.right, a.innerWidth) -
                            c.max(e.left, 0)) * c.max(0, c.min(e.bottom, a.innerHeight) - c.max(e.top, 0)) / e.width / e.height > $["@s"]), !u && b.body.contains && !b.body.contains(l))) return p.clearRect($["@r"], $["@r"], $["@i"], $["@v"]);
                    u && (p.globalCompositeOperation = "destination-in", p.globalAlpha = c.pow($["@m"], k), p.fillRect($["@r"], $["@r"], $["@i"], $["@v"]), p.globalCompositeOperation = "source-over", p.globalAlpha = 1, q(k));
                    m.call(a, h)
                }
                var g = this.getElementsByTagName("canvas")[0];
                if (g && g.getContext && g.getBoundingClientRect && d.now) {
                    var l = this.parentNode,
                        n, m = a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame || function(a) {
                            var b = d.now(),
                                h = c.max(0, 16 - (b - n));
                            a = setTimeout(a, h);
                            n = b + h;
                            return a
                        },
                        p = g.getContext("2d"),
                        q = e.call(this, a, c, p, k),
                        t = d.now(),
                        r = 0,
                        u = !1;
                    m.call(a, h)
                }
            }
        },
        t = {
            Tc: function() {
                var a = B.getElementsByTagName("menu")[0];
                t.Qi = d.a("a", {
                    textContent: n.V,
                    onclick: function() {
                        t.open();
                        return !1
                    }
                });
                var b = d.a("li", {
                    id: "menu-share",
                    children: [t.Qi]
                });
                a.insertBefore(b, a.firstChild);
                t.Eh = {
                    embed: !0
                };
                for (a = 0; b = ["image", "live"][a]; a++) {
                    var c =
                        d.Qe("cutter-" + b);
                    t.Eh[b] = c ? "1" == c : !0
                }
            },
            open: function() {
                function a(a) {
                    f[h] && (f[h].className = "");
                    f[a].className = "active";
                    h = a;
                    a = "";
                    var b = f[h].childNodes[1];
                    C.className = "";
                    C.onmouseover = null;
                    t.qg.disabled = !1;
                    0 == h ? (t.xe.focus(), t.xe.select(), b.appendChild(x), x.firstChild.data = n.Z) : 1 == h ? (b.appendChild(w), b.appendChild(u), b.appendChild(r), a = "image") : 2 == h && (b.appendChild(w), b.appendChild(x), b.appendChild(u), x.firstChild.data = n.Ie, a = "live");
                    g && (u.firstChild.textContent = n.W, m.style.display = "", q.style.display =
                        p.style.display = "none", p.value = "", g = !1);
                    t.Gh(a)
                }

                function b() {
                    l.log("share", "action-" + ["image", "live", "embed", "gif", "video"][h]);
                    t.Ne.style.backgroundColor = "#FFF";
                    requestAnimationFrame(function() {
                        t.Ne.style.backgroundColor = "rgba(255,255,255,0.5)";
                        requestAnimationFrame(function() {
                            t.Ne.style.backgroundColor = "rgba(255,255,255,0.25)";
                            requestAnimationFrame(function() {
                                t.Ne.style.backgroundColor = ""
                            })
                        })
                    });
                    var a = l.Gg(A.$f + A.Yf / 2, A.$e + A.Xf / 2),
                        b = R.Pg(t.ih.checked && (3 < P ? a : null), t.Ei.checked, t.Fi.checked, t.vk.value,
                            t.rk.checked, t.tk.checked);
                    if (1 == h) {
                        var c, d, f;
                        "png" == B.value ? (c = "image/png", d = 1, f = "png") : (c = "image/jpeg", d = B.value / 100, f = "jpg");
                        b = R.Vj(A.$f, A.$e, A.Yf, A.Xf, c, d, b);
                        R.Wk(b, R.Uj(a) + "." + f)
                    } else 2 == h && (f = z.fd.scrollTop, c = u.getBoundingClientRect().top - m.getBoundingClientRect().top, m.style.display = "none", w.parentNode.removeChild(w), x.parentNode.removeChild(x), q.style.display = p.style.display = "", p.style.height = "50px", u.parentNode.appendChild(u), p.style.height = c - (u.getBoundingClientRect().top - p.getBoundingClientRect().top -
                        50) + "px", z.fd.scrollTop = f, a.zoom = P, a = R.bi(t.mh.checked && a, t.Rf.checked, t.lf.checked, t.mf.checked), a = R.Xj(A.$f, A.$e, A.Yf, A.Xf, a, b), p.value = a, p.focus(), p.select(), u.firstChild.textContent = n.Bb, g = !0)
                }
                l.log("share", "open");
                R.Gd || (R.Gd = d.a("img", {
                    src: Qa
                }));
                var c = z.create(null, n.$, !1);
                z.wg = t.pf;
                c.className = "share";
                z.Te = "#share";
                d.a(0, {
                    className: "section",
                    children: [d.a(0, {
                        className: "header clearfix",
                        children: [d.a("h1", {
                            textContent: n.$
                        })]
                    }), d.a(0, {
                        className: "subheader clearfix",
                        children: [d.a(0, {
                            className: "destination",
                            textContent: n.sc
                        })]
                    })],
                    parent: c
                });
                for (var f = [], e = ["", n.De, n.Fe, n.Jh, n.Kh, n.Lh], k = 0; 4 > k; k++) f.push(d.a("li", {
                    children: [d.a("label", {
                        children: [d.a("input", {
                            type: "radio",
                            name: "share-type",
                            onclick: function() {
                                a(this)
                            }.bind(k)
                        }), d.a("span", {
                            textContent: [n.Dc, n.Ac, n.Fc, n.tc, n.Cb, n.ad][k]
                        })]
                    }), d.a(0, {
                        className: "share_block clearfix",
                        children: [k ? d.a("p", {
                            innerHTML: e[k]
                        }) : ""]
                    })]
                }));
                d.a("ul", {
                    className: "share_menu clearfix",
                    children: f,
                    parent: c
                });
                var h = -1,
                    g;
                t.xe = d.a("input", {
                    type: "url",
                    value: qa,
                    className: "aa",
                    style: "width: 100%; margin: 0 0 0.5em",
                    parent: f[0].childNodes[1]
                });
                t.mi(t.xe);
                var m = d.a("p", {
                        innerHTML: n.Ge,
                        parent: f[2].childNodes[1]
                    }),
                    p = d.a("textarea", {
                        className: "aa sg",
                        style: "width: 100%; font-size: 80%; display: none; margin-bottom: 0.666em; word-break: break-all",
                        parent: f[2].childNodes[1]
                    });
                t.mi(p);
                var q = d.a("p", {
                        innerHTML: n.He,
                        style: "display: none",
                        parent: f[2].childNodes[1]
                    }),
                    r = d.a("p", {
                        innerHTML: n.Ee,
                        parent: f[1].childNodes[1]
                    }),
                    u = d.a("p", {
                        style: "text-align: center",
                        children: [d.a("a", {
                            className: "share_action",
                            innerHTML: n.W,
                            onclick: function() {
                                if (g) return a(h);
                                b()
                            }
                        })]
                    }),
                    x = t.Kj(function() {
                        t.Sh();
                        0 == h && (t.xe.focus(), t.xe.select())
                    }),
                    B;
                d.a("label", {
                    style: "margin: 0 0 0.5em",
                    children: [n.Fb + ": ", B = d.a("select", {
                        children: [d.a("option", {
                            textContent: "PNG",
                            value: "png"
                        })],
                        onchange: function() {
                            d.Ae("image-quality", this.value)
                        }
                    }), "."],
                    parent: f[1].childNodes[1]
                });
                c = d.Qe("image-quality") || 90;
                for (k = 0; k < Ca.length; k++) d.a("option", {
                    textContent: "JPEG " + Ca[k] + "%",
                    value: Ca[k],
                    parent: B,
                    selected: Ca[k] == c
                });
                var A = {
                        $f: 0,
                        $e: 0,
                        Yf: H,
                        Xf: J
                    },
                    w = t.Ij(A);
                t.Ne.oncontextmenu = function() {
                    g && a(h);
                    l.log("share", "rmb");
                    b();
                    return !1
                };
                var C = d.a(0, {
                    id: "socbuttons",
                    className: "dormant",
                    children: t.Ze = [d.a("a", {
                        className: "socbutton socbutton-em",
                        target: "_blank"
                    }), d.a("a", {
                        className: "socbutton socbutton-vk",
                        target: "_blank"
                    }), d.a("a", {
                        className: "socbutton socbutton-rd",
                        target: "_blank"
                    }), d.a("a", {
                        className: "socbutton socbutton-gp",
                        target: "_blank"
                    }), d.a("a", {
                        className: "socbutton socbutton-tw",
                        target: "_blank"
                    }), d.a("a", {
                        className: "socbutton socbutton-fb",
                        target: "_blank"
                    })],
                    parent: f[0],
                    onmouseover: function() {
                        f[0].firstChild.firstChild.checked = !0;
                        C.className = "";
                        a(0)
                    }
                });
                t.Sh()
            },
            mi: function(a) {
                a.readOnly = !0;
                a.onfocus = function() {
                    this.select();
                    setTimeout(function() {
                        B.execCommand("selectAll")
                    }, 1)
                };
                a.onclick = a.createTextRange ? function() {
                    var b = a.createTextRange();
                    b.select();
                    b.execCommand("Copy")
                } : function() {
                    this.select()
                }
            },
            Sh: function() {
                if (t.xe) {
                    t.ih.parentNode.style.display = 3 < P ? "" : "none";
                    t.mf.parentNode.style.visibility = "normal" == l.kd ? "hidden" : "";
                    t.lf.parentNode.childNodes[2].data =
                        "normal" == l.kd ? "." : ",";
                    var a = t.mh.checked && l.Fg(),
                        b = R.bi(a, t.Rf.checked, t.lf.checked, t.mf.checked);
                    t.xe.value = b;
                    var a = (R.Pg(3 < P ? a : null, t.Rf.checked, t.lf.checked, "").info.join(", ") || n.I) + " \u2013 ",
                        c = "VentuSky: " + (R.Pg(!1, t.Rf.checked, t.lf.checked, "").info.join(", ") || n.I);
                    t.Ze[5].href = "https://facebook.com/sharer/sharer.php?u=" + encodeURIComponent(b);
                    t.Ze[4].href = "https://twitter.com/intent/tweet/?text=" + encodeURIComponent(a) + "&url=" + encodeURIComponent(b) + "&related=Ventuskycom&via=Ventuskycom";
                    t.Ze[3].href =
                        "https://plus.google.com/share?url=" + encodeURIComponent(b);
                    t.Ze[2].href = "https://www.reddit.com/submit?resubmit=true&url=" + encodeURIComponent(b) + "&title=" + encodeURIComponent(c);
                    t.Ze[1].href = "http://vk.com/share.php?url=" + encodeURIComponent(b);
                    t.Ze[0].href = "mailto:?subject=" + encodeURIComponent(c) + "&body=" + encodeURIComponent(c + "\r\n\r\n" + b)
                }
            },
            pf: function() {
                t.Gh("");
                t.bd.parentNode.removeChild(t.bd);
                delete t.xe;
                t.mf = t.lf = t.Rf = t.mh = null;
                t.qg = t.gf = t.ff = t.bd = t.Ne = null;
                t.Ei = t.ih = t.Fi = null;
                t.lg = null;
                t.Ze =
                    null
            },
            resize: function() {
                t.lg && t.lg()
            },
            Ij: function(a) {
                function b(a) {
                    if (E) {
                        var b = 45 * E,
                            d = H,
                            f = J;
                        d / f > E ? d = k.round(f * E) : f = k.round(d / E);
                        C ? (D = k.max(k.min(t.ff.value | 0, f), 45), x = k.round(D * E)) : (x = k.max(k.min(t.gf.value | 0, d), b), D = k.round(x / E))
                    } else D = k.max(k.min(t.ff.value | 0, J), 45), x = k.max(k.min(t.gf.value | 0, H), 45);
                    if (!a || C) t.gf.value = x;
                    a && C || (t.ff.value = D);
                    O = k.max(k.round((H - (H > 780 * F ? 540 * F : 0) - x) / 2), 0);
                    w = k.round((J - D) / 2);
                    c();
                    g()
                }

                function c() {
                    t.qg.checked ? (a.$f = O, a.$e = w, a.Yf = x, a.Xf = D, f()) : (a.$f = 0, a.$e = 0, a.Yf = H,
                        a.Xf = J)
                }

                function f() {
                    clearTimeout(V);
                    V = setTimeout(function() {
                        d.Ae("cutter-state", x + "," + D + "," + (E ? I ? "l" : ga.selectedIndex : "x"))
                    }, 500)
                }

                function g() {
                    var a = H,
                        b = J;
                    t.bd.childNodes[0].style.height = t.bd.childNodes[2].style.top = t.bd.childNodes[3].style.top = t.bd.childNodes[4].style.top = k.round(w / F) + "px";
                    t.bd.childNodes[1].style.top = k.round(w + D) / F + "px";
                    t.bd.childNodes[1].style.height = k.round((b - w - D) / F) + "px";
                    t.bd.childNodes[2].style.height = t.bd.childNodes[3].style.height = t.bd.childNodes[4].style.height = k.round(D /
                        F) + "px";
                    t.bd.childNodes[2].style.width = t.bd.childNodes[4].style.left = k.round(O / F) + "px";
                    t.bd.childNodes[3].style.left = k.round((O + x) / F) + "px";
                    t.bd.childNodes[3].style.width = k.round((a - O - x) / F) + "px";
                    t.bd.childNodes[4].style.width = k.round(x / F) + "px";
                    m(T)
                }

                function m(a) {
                    var b = a;
                    H > 780 * F ? (b = a && (540 * F + x - H) / F, z.fd.childNodes[0].style.background = 0 < b ? "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.8) " + k.max(b - 20, 0) + "px, #FFF " + (b + 20) + "px)" : "", oa[4].style.right = (0 < b ? b + 20 : k.max(b / 2 + 20, -12)) + "px",
                        ha.style.left = k.round(x / F) + "px", ha.style.display = 0 < b ? "" : "none", b = a && (D > J - 340 * F || x > H - 880 * F)) : z.fd.childNodes[0].style.background = a ? "rgba(255,255,255,0.8)" : "";
                    B.documentElement.className = b ? "q" : ""
                }

                function h() {
                    oa[4].firstChild.style.borderLeftWidth = E ? "2px" : "0";
                    f()
                }

                function q(a) {
                    if (I != a)
                        if (I = a) {
                            a: {
                                a = x;
                                var b = D;0 > a && (a = -a);0 > b && (b = -b);
                                if (b > a) {
                                    var c = a;
                                    a = b;
                                    b = c
                                }
                                for (;;) {
                                    if (0 == b) break a;
                                    a %= b;
                                    if (0 == a) {
                                        a = b;
                                        break a
                                    }
                                    b %= a
                                }
                            }
                            5 > a && (a = 1);ra.textContent = x / a + ":" + D / a;ga.appendChild(ra)
                        }
                    else ga.removeChild(ra)
                }
                for (var r = [], u = 0; u < ta.length; u += 2) r.push(ta[u] / ta[u + 1]);
                var A = (d.Qe("cutter-state") || "640,360,0").split(","),
                    C = 0,
                    E = r[A[2]];
                "l" == A[2] && (E = A[0] / A[1]);
                var x = k.min(A[0], H, E ? J * E : Infinity),
                    D = k.min(A[1], J, E ? H / E : Infinity),
                    O, w;
                t.gf = d.a("input", {
                    type: "number",
                    className: "aa sg",
                    style: "width: 3.875em; text-align: right",
                    value: x,
                    oninput: function() {
                        C = 0;
                        b(!0)
                    },
                    onblur: function() {
                        this.value = x
                    }
                });
                t.ff = d.a("input", {
                    type: "number",
                    className: "aa sg",
                    style: "width: 3.875em; text-align: right",
                    value: D,
                    oninput: function() {
                        C = 1;
                        b(!0)
                    },
                    onblur: function() {
                        this.value = D
                    }
                });
                var V;
                t.lg = function() {
                    b()
                };
                var ha = d.a(0, {
                        style: "position: absolute; top: 50%; display: none; width: 12px; height: 32px; margin: -16px -6px; border: 4px solid #f7a715; border-width: 0 4px; z-index: 12; cursor: e-resize; -webkit-touch-callout: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;",
                        parent: B.body
                    }),
                    oa = [d.a(0, {
                            children: [d.a("span", {
                                style: "border-width: 4px 0 0 0"
                            })],
                            style: "height: 20px; top: -12px; cursor: n-resize"
                        }),
                        d.a(0, {
                            children: [d.a("span", {
                                style: "border-width: 0 0 4px 0"
                            })],
                            style: "height: 20px; top: auto; bottom: -12px; cursor: s-resize"
                        }), d.a(0, {
                            children: [d.a("span", {
                                style: "border-width: 0 0 0 4px"
                            })],
                            style: "width: 20px; left: -12px; height: 100%; cursor: w-resize"
                        }), d.a(0, {
                            children: [d.a("span", {
                                style: "border-width: 0 4px 0 0"
                            })],
                            style: "width: 20px; left: auto; right: -12px; height: 100%; cursor: e-resize"
                        }), d.a(0, {
                            children: [d.a("span", {
                                style: "border-width: 2px 2px 8px 2px; border-radius: 6px 6px 0 0; width: 12px; margin: -8px -6px; box-shadow: 0 0 4px #000"
                            })],
                            style: "width: 20px; height: 20px; left: auto; right: -12px; top: -22px; cursor: pointer",
                            onclick: function() {
                                if (E) E = 0, q(!1), Ya.selected = !0;
                                else {
                                    for (var a = 0; a < r.length; a++)
                                        if (k.round(x / r[a]) == D || k.round(D * r[a]) == x) {
                                            E = r[a];
                                            ga.selectedIndex = a;
                                            break
                                        }
                                    a == r.length && (E = x / D, q(!0), ra.selected = !0)
                                }
                                h();
                                E && b()
                            }
                        })
                    ];
                t.Ne = d.a(0, {
                    id: "x",
                    children: oa
                });
                t.bd = d.a(0, {
                    id: "b",
                    children: [d.a(0), d.a(0), d.a(0), d.a(0), t.Ne],
                    ontouchstart: function(a) {
                        if (!S) return p.ka.ontouchstart(a)
                    },
                    onmousedown: function(a) {
                        if (!S) return p.ka.onmousedown(a)
                    },
                    onwheel: p.ka.onwheel,
                    onmousewheel: p.ka.onmousewheel,
                    parent: B.body
                });
                for (var S = !1, u = 0; 4 > u; u++)(function(a) {
                    function c(h) {
                        var k = 3 == a ? (H - (H > 780 * F ? 540 * F : 0)) / F : Infinity;
                        S = e.paused = !0;
                        var g = h[d];
                        g > k && (g = (g - k) / f * F + k);
                        var l = 2 > a ? D : x,
                            n = 2 > a ? t.ff : t.gf,
                            m = 0;
                        C = 2 > a;
                        oa[a].firstChild.style.ld = "#f7a715";
                        return {
                            qf: function(a) {
                                a = a[d];
                                a > k && (a = (a - k) / f * F + k);
                                a = a - g;
                                a < m && (a += 1 / f);
                                m = a;
                                n.value = l + a * f;
                                b();
                                return !1
                            },
                            rf: function() {
                                oa[a].firstChild.style.ld = "";
                                S = e.paused = !1
                            }
                        }
                    }
                    var d = "client" + (2 > a ? "Y" : "X"),
                        f = (a % 2 ? 2 : -2) * F;
                    Ba(oa[a], c);
                    3 == a && Ba(ha, c)
                })(u);
                var T, N;
                t.Gh = function(a) {
                    "boolean" == typeof a ? (t.Eh[N] = a, d.Ae("cutter-" + N, a ? "1" : "0")) : (N = a, a = t.Eh[N]);
                    a != T && (T = a, t.qg.checked = a, t.bd.style.display = a ? "block" : "", na.style.display = a ? "inline" : "", na.childNodes[2].data = a ? n.Db + ": " : n.Eb + ".", Ma.style.display = a ? "inline" : "none", a ? g() : m(!1), c())
                };
                for (var na = d.a("label", {
                        style: "",
                        children: [t.qg = d.a("input", {
                            type: "checkbox",
                            onclick: function() {
                                t.Gh(this.checked)
                            }
                        }), " ", n.Eb + "."]
                    }), ga = d.a("select", {
                        onchange: function() {
                            q(!1);
                            E = r[this.selectedIndex] ||
                                0;
                            h();
                            b()
                        }
                    }), u = 0; u < ta.length; u += 2) d.a("option", {
                    textContent: ta[u] == Ka ? n.Cc : ta[u] + ":" + ta[u + 1],
                    parent: ga
                });
                var Ya = d.a("option", {
                        textContent: n.Hb,
                        selected: !0,
                        parent: ga
                    }),
                    I = !1,
                    ra = d.a("option", {
                        textContent: "\ufffd"
                    });
                "x" == A[2] ? h() : "l" == A[2] ? (q(!0), ra.selected = !0) : ga.selectedIndex = A[2];
                var Ma = d.a("span", {
                        style: "display: none",
                        children: [d.a("span", {
                            style: "white-space: nowrap",
                            children: [t.gf, "px \u00d7 ", t.ff, "px,"]
                        }), d.a("wbr"), d.a("span", {
                            style: "white-space: nowrap",
                            children: [" " + n.Gb + ": ", ga, "."]
                        })]
                    }),
                    u = d.a(0, {
                        style: "margin-top: 0.5em",
                        children: [n.Bc, ":", d.a(0, {
                            style: "-webkit-columns: 2; -moz-columns: 2; columns: 2",
                            children: [t.vk = d.a("input", {
                                className: "aa",
                                style: (t.Yh ? "" : "display: none;") + "width: 90%; font-size: 80%",
                                placeholder: "Text..."
                            }), d.a("label", {
                                style: t.Yh ? "" : "display: none;",
                                children: [t.tk = d.a("input", {
                                    type: "checkbox",
                                    checked: !0
                                }), " logo,"]
                            }), d.a("label", {
                                children: [t.Ei = d.a("input", {
                                    type: "checkbox",
                                    checked: !0
                                }), " " + n.Ib + ","]
                            }), d.a("label", {
                                children: [t.ih = d.a("input", {
                                    type: "checkbox",
                                    checked: !0
                                }), " " + n.X + ","]
                            }), d.a("label", {
                                children: [t.Fi = d.a("input", {
                                    type: "checkbox",
                                    checked: !0
                                }), " " + n.Y + ","]
                            }), d.a("label", {
                                children: [t.rk = d.a("input", {
                                    type: "checkbox",
                                    checked: !l.ae
                                }), " " + n.Jb + "."]
                            })]
                        })]
                    });
                t.lg();
                clearTimeout(V);
                return d.a(0, {
                    style: "margin-bottom: 0.5em",
                    children: [na, Ma, u]
                })
            },
            Kj: function(a) {
                return d.a(0, {
                    style: "margin-bottom: 0.666em",
                    children: [n.Z, ":", d.a(0, {
                        style: "-webkit-columns: 2; -moz-columns: 2; columns: 2",
                        children: [d.a("label", {
                            children: [t.Rf = d.a("input", {
                                type: "checkbox",
                                onclick: a,
                                checked: !0
                            }), " " + n.Ib + ","]
                        }), d.a("label", {
                            children: [t.mh = d.a("input", {
                                type: "checkbox",
                                onclick: a,
                                checked: !0
                            }), " " + n.X + ","]
                        }), d.a("label", {
                            children: [t.lf = d.a("input", {
                                type: "checkbox",
                                onclick: a,
                                checked: !0
                            }), " " + n.Y, ","]
                        }), d.a("label", {
                            children: [t.mf = d.a("input", {
                                type: "checkbox",
                                onclick: a,
                                checked: "off" != l.kd
                            }), " " + n.Kb + "."]
                        })]
                    })]
                })
            },
            Re: function() {
                t.Qi.textContent = n.V
            }
        },
        m = {
            Le: 0,
            Xh: 1,
            Qd: function(a, b) {
                var c = B.createElementNS("http://www.w3.org/2000/svg", a);
                if (!b) return c;
                for (var d in b) c.setAttribute(d,
                    b[d]);
                return c
            },
            Of: function() {
                return Oa.Of.apply(Oa, arguments)
            },
            Tc: function(a, b, c) {
                la.Bj();
                m.aa = [];
                for (var f in m.Mc.aa) {
                    var e = {};
                    e.alt = parseFloat(f);
                    e.top = m.color(m.Mc.aa[f].top);
                    e.bottom = m.color(m.Mc.aa[f].bottom);
                    e.rd = m.Mc.aa[f].rd;
                    e.qd = m.Mc.aa[f].qd;
                    m.aa.push(e)
                }
                m.aa.sort(function(a, b) {
                    return b.alt - a.alt
                });
                m.aa.unshift({
                    alt: 180,
                    top: m.aa[0].top,
                    bottom: m.aa[0].bottom,
                    rd: m.aa[0].rd,
                    qd: m.aa[0].qd
                });
                m.aa.reverse();
                m.aa.unshift({
                    alt: -180,
                    top: m.aa[0].top,
                    bottom: m.aa[0].bottom,
                    rd: m.aa[0].rd,
                    qd: m.aa[0].qd
                });
                m.Ii = a;
                m.Pi = b;
                m.time = c;
                m.Td = m.getTimezoneOffset(m.time);
                var g = d.Qc("astro-date");
                if (g) {
                    var h = d.Qc("astro-date-next"),
                        l = d.Qc("astro-date-prev");
                    g.onchange = function() {
                        var a = new Date(1E3 * g.value);
                        m.Qj(a.getFullYear(), a.getMonth(), a.getDate());
                        h.className = h.className.replace(/ inactive/, "") + (g.selectedIndex >= g.options.length - 1 ? " inactive" : "");
                        l.className = l.className.replace(/ inactive/, "") + (0 >= g.selectedIndex ? " inactive" : "")
                    };
                    d.Qc("astro-date-next").onclick = function() {
                        g.selectedIndex = k.min(g.selectedIndex +
                            1, g.options.length - 1);
                        g.onchange();
                        g.Ig && g.Ig();
                        return !1
                    };
                    d.Qc("astro-date-prev").onclick = function() {
                        g.selectedIndex = k.max(g.selectedIndex - 1, 0);
                        g.onchange();
                        g.Ig && g.Ig();
                        return !1
                    }
                }
                m.jh();
                var n = (d.Qc("astro-sun") || {}).offsetWidth + "/" + (d.Qc("astro-moon") || {}).offsetWidth;
                A.addEventListener("resize", m.Ch = function() {
                    var a = (d.Qc("astro-sun") || {}).offsetWidth + "/" + (d.Qc("astro-moon") || {}).offsetWidth;
                    n != a && (n = a, m.jh())
                }, !1)
            },
            bk: function() {
                m.Ch && (A.removeEventListener("resize", m.Ch, !1), delete m.Ch)
            },
            jh: function() {
                m.gi(m.Le,
                    m.Ii, m.Pi);
                m.gi(m.Xh, m.Ii, m.Pi);
                m.aj()
            },
            ye: "nightEnd nauticalDawn dawn rise set dusk nauticalDusk night".split(" "),
            table: function(a, b, c, f) {
                var e = d.Qc("astro-" + ["sun", "moon"][a] + "-table");
                if (e) {
                    for (; e.rows[1];) e.deleteRow(1);
                    if (a == m.Le) {
                        m.ui || (m.ui = e.rows[0].cells[0].innerHTML);
                        e.rows[0].cells[0].innerHTML = m.ui + " " + m.bh(m.time);
                        c = new Date(+m.time);
                        c.Be(m.Td);
                        c.setHours(0, 0, 0, 0);
                        f = new Date(+c + 864E5);
                        f.Be(m.Td);
                        var k = m.Mc.ye[0];
                        for (a = 0; 9 > a; a++) {
                            var h = 8 == a ? f : b[m.ye[a]];
                            if (+h) {
                                var g = e.insertRow(-1);
                                g.insertCell(-1).innerHTML =
                                    '<span style="display: inline-block; width: 0.75em; height: 0.75em; border: 1px solid #BBB; border-color: rgba(0,0,0,0.166); background: ' + (k.Kl || k.color) + '"></span> ' + k.label();
                                g.insertCell(-1).innerHTML = m.Rd(c) + " " + n.ca + " " + m.Rd(h);
                                g.insertCell(-1).innerHTML = m.dl(h - c);
                                c = h;
                                8 > a && (k = m.Mc.ye[a + 1] || m.Mc.ye[7 - a])
                            } else 5 > a && (k = m.Mc.ye[a + 1])
                        }
                    } else
                        for (b = new Date(+m.time), b.Be(m.Td), b.setHours(12, 0, 0, 0), a = 0; 5 > a; a++) {
                            g = e.insertRow(-1);
                            g.insertCell(-1).innerHTML = '<span style="display: inline-block; width: 0.75em; height: 0.75em; border: 1px solid #000; border-radius: 100%; background: #000; overflow: hidden"><span style="display: block; width: 100%; height: 100%; margin-left: ' +
                                (100 - 200 * la.Nf(b).xg) + '%; background: #FFF"></span></span> ' + m.bh(b);
                            k = m.getTimezoneOffset(b);
                            h = m.Of(b, c, f);
                            h.set && h.set.Be(k);
                            h.rise && h.rise.Be(k);
                            if (h.alwaysUp || h.alwaysDown) g.insertCell(-1).innerHTML = "&mdash;", g.insertCell(-1).innerHTML = "&mdash;", g.insertCell(-1).innerHTML = "&mdash;"; + h.rise > +h.set ? (g.insertCell(-1).innerHTML = "&mdash;", g.insertCell(-1).innerHTML = m.Rd(h.set), g.insertCell(-1).innerHTML = m.Rd(h.rise)) : (g.insertCell(-1).innerHTML = m.Rd(h.rise), g.insertCell(-1).innerHTML = m.Rd(h.set), g.insertCell(-1).innerHTML =
                                "&mdash;");
                            k = b.setHours(0);
                            h = b.setHours(23, 59, 59);
                            g.insertCell(-1).innerHTML = m.dh(la.Nf(k).Mf) + " " + n.ca + " " + m.dh(la.Nf(h).Mf);
                            b.setHours(36)
                        }
                }
            },
            dl: function(a) {
                a = k.round(a / 6E4);
                return 60 < a ? k.floor(a / 60) + " " + n.Nb + " " + a % 60 + " " + n.ba : a + " " + n.ba
            },
            yg: [],
            qh: function() {
                clearTimeout(m.ph);
                m.Zh = 300;
                return !1
            },
            Si: function(a) {
                clearTimeout(m.ph);
                var b = this.getBoundingClientRect();
                a = k.min(k.max((a.clientX - b.left) / (b.right - b.left), 0), 1);
                m.Mg(a)
            },
            oh: function() {
                clearTimeout(m.ph);
                m.ph = setTimeout(function() {
                    m.Zh = 500;
                    m.aj(!0)
                }, 100);
                return !1
            },
            aj: function(a) {
                var b = new Date(+m.time);
                b.setHours(0, 0, 0, 0);
                b = (m.time - b) / 864E5;
                a ? m.Mg(b) : m.setPosition(b)
            },
            Mg: function(a) {
                m.$k = a;
                if (!m.vh) {
                    var b = +new Date;
                    m.vh = setInterval(function() {
                        var a = +new Date;
                        step = (a - b) / m.Zh;
                        b = a;
                        a = m.$k - m.ti;
                        k.abs(a) < step ? (clearInterval(m.vh), m.vh = null) : a = k.min(k.max(a, -step), step);
                        m.setPosition(m.ti + a)
                    }, 13)
                }
            },
            setPosition: function(a) {
                m.ti = a;
                for (var b = 0; b < m.yg.length; b++) m.yg[b](a)
            },
            Qj: function(a, b, c) {
                m.time.setFullYear(a, b, c);
                m.Td = m.getTimezoneOffset(m.time);
                m.yg.length = 0;
                m.jh()
            },
            Yk: function(a) {
                if (!a.Dj) {
                    a.Dj = !0;
                    a.addEventListener("mousemove", m.Si, !1);
                    a.addEventListener("mouseout", m.oh, !1);
                    a.addEventListener("mouseover", m.qh, !1);
                    var b = function() {
                            b = null;
                            a.removeEventListener("mousemove", m.Si);
                            a.removeEventListener("mouseout", m.oh);
                            a.removeEventListener("mouseover", m.qh)
                        },
                        c = d.a(0),
                        f = d.a(0),
                        e = !1;
                    c.appendChild(f);
                    c.style.cssText = "position: absolute; left: 0; right: 0; top: 0; bottom: 0; overflow: auto; z-index: 1000";
                    f.style.cssText = "width: 200%; height: 100%; background: rgba(0,0,0,0)";
                    c.onscroll = function() {
                        e && m.Mg(k.min(k.max((a.offsetWidth - this.scrollLeft) / a.offsetWidth, 0), 1))
                    };
                    a.appendChild(c);
                    c.scrollHeight - c.offsetHeight && a.removeChild(c);
                    a.addEventListener("touchstart", function(d) {
                        b && b();
                        c.scrollLeft = a.getBoundingClientRect().right - d.touches[0].clientX;
                        e = !0;
                        return m.qh.call(this, d.touches[0])
                    }, !1);
                    f = function() {
                        e = !1;
                        return m.oh.apply(this, arguments)
                    };
                    a.addEventListener("touchend", f, !1);
                    a.addEventListener("touchcancel", f, !1)
                }
            },
            gi: function(a, b, c) {
                function f(a) {
                    var b = new Date(+m.time);
                    b.setHours(0, 1440 * a);
                    var c = t[k.floor(l * a)],
                        d = u[k.floor(l * a)].altitude / k.PI * 180;
                    m.Pe(e + "-time", m.Rd(b));
                    m.Pe(e + "-altitude", (0 != c.altitude ? 0 > c.altitude ? "&minus;" : "+" : "") + k.abs(k.round(c.altitude / k.PI * 180)) + " \u00b0");
                    m.Pe(e + "-azimuth", '<span style="' + "-webkit-#-moz-#-ms-#-o-##".replace(/#/g, "transform: rotate(" + c.azimuth.toFixed(3) + "rad);") + '; display: inline-block; vertical-align: middle; width: 1em; text-align: center">&darr;</span>' + na[(c.azimuth / k.PI * 4 + 4.5) % 8 | 0]);
                    m.Pe(e + "-fraction", m.dh(c.Mf));
                    m.Pe(e + "-phase", m.Mc.ye[-.833 > d ? -6 > d ? -12 > d ? -18 > d ? 0 : 1 : 2 : 3 : 4].label());
                    N.style.left = k.floor(l * a) + "px";
                    for (a = 0; a < m.aa.length && !(d < m.aa[a].alt); a++);
                    a >= m.aa.length || (d = (d - m.aa[a - 1].alt) / (m.aa[a].alt - m.aa[a - 1].alt), S.style.opacity = k.min(k.max(m.ei(m.aa[a - 1].rd, m.aa[a].rd, d), 0), 1), T.style.opacity = k.min(k.max(m.ei(m.aa[a - 1].qd, m.aa[a].qd, d), 0), 1), C.setAttribute("stop-color", m.ni(m.aa[a - 1].top, m.aa[a].top, d)), E.setAttribute("stop-color", m.ni(m.aa[a - 1].bottom, m.aa[a].bottom, d)), N.style.top = p / 2 - c.altitude /
                        k.PI * p + "px")
                }
                var e = "astro-" + ["sun", "moon"][a],
                    g = d.Qc(e);
                if (g) {
                    for (var h = 0; g.childNodes[h];) g.childNodes[h].onscroll ? h++ : g.removeChild(g.childNodes[h]);
                    g.style.position = "relative";
                    g.style.webkitUserSelect = "none";
                    g.style.MozUserSelect = "none";
                    g.style.msUserSelect = "none";
                    g.style.userSelect = "none";
                    var l = g.offsetWidth,
                        p = g.offsetHeight,
                        q = m.Qd("svg", {
                            width: "100%",
                            height: "100%"
                        });
                    g.addEventListener ? m.Yk(g) : g.style.display = "none";
                    var r = new Date(+m.time);
                    r.Be(m.Td);
                    r.setHours(0, 0, 0, 0);
                    m.Pe(e + "-date", m.bh(r));
                    m.Pe(e + "-timezone", "UTC+" + (m.Td / 60 + 100 + "").slice(1) + ":" + (m.Td % 60 + 100 + "").slice(1));
                    for (var t = [], u = a == m.Le ? t : [], x = -1, z = 0, A = [], h = 0; h <= l; h++) {
                        r.setHours(0, h / l * 1440);
                        var w = a == m.Le ? la.Ci(r, b, c) : la.og(r, b, c);
                        t.push(w);
                        a != m.Le && (u.push(la.Ci(r, b, c)), w.Mf = la.Nf(r).Mf);
                        w = u[h].altitude / k.PI * 180;
                        w = h != l ? -.833 > w ? -6 > w ? -12 > w ? -18 > w ? 0 : 1 : 2 : 3 : 4 : -1;
                        w != x && (-1 < x && A.push({
                            xg: m.Mc.ye[x],
                            start: z,
                            length: h - z
                        }), z = h, x = w)
                    }
                    r = [];
                    for (h = 0; h < t.length; h++) h && .1 < k.abs(t[h].altitude - t[h - 1].altitude) && t[h + 1] && (t[h].altitude = (t[h - 1].altitude +
                        t[h + 1].altitude) / 2), r.push(h + " " + (p / 2 - t[h].altitude / k.PI * p).toFixed(3));
                    for (h = 0; h < A.length; h++) q.appendChild(m.Qd("rect", {
                        x: A[h].start,
                        y: "50%",
                        width: A[h].length,
                        height: "50%",
                        fill: A[h].xg.color
                    }));
                    var h = m.Qd("path", {
                            d: "M" + r.join("L"),
                            stroke: "#111",
                            "stroke-width": "1px",
                            fill: "none",
                            "stroke-dasharray": "1 6"
                        }),
                        A = m.Qd("rect", {
                            width: "100%",
                            height: "50%",
                            fill: "url(#astro-back)"
                        }),
                        r = m.Qd("linearGradient", {
                            id: "astro-back",
                            y1: "0%",
                            y2: "100%",
                            x1: "50%",
                            x2: "50%"
                        }),
                        C = m.Qd("stop", {
                            "stop-color": "#0072B5",
                            offset: 0
                        }),
                        E = m.Qd("stop", {
                            "stop-color": "#B4D4E9",
                            offset: 1
                        });
                    r.appendChild(C);
                    r.appendChild(E);
                    q.appendChild(r);
                    q.appendChild(A);
                    q.appendChild(h);
                    h = h.cloneNode(!0);
                    h.setAttribute("stroke", "#EEE");
                    h.setAttribute("stroke-dashoffset", "3.5");
                    q.appendChild(h);
                    h = m.Qd("path", {
                        d: "M0 " + p / 2 + " h" + l,
                        stroke: "rgba(0,0,0,0.25)",
                        "stroke-width": "1px",
                        fill: "none"
                    });
                    q.appendChild(h);
                    h = new Date(+m.time);
                    h.Be(m.Td);
                    h.setHours(12, 0, 0, 0);
                    var A = a == m.Le ? la.nk(h, b, c) : m.Of(h, b, c),
                        D;
                    for (D in m.Mc.Xc) A[D] && !isNaN(A[D]) && (A[D].Be(m.Td), x =
                        (60 * A[D].getHours() + A[D].getMinutes()) / 1440 * l, h = m.Qd("path", {
                            d: "M" + (60 * A[D].getHours() + A[D].getMinutes()) / 1440 * l + " " + (p / 2 - 5) + " v 10",
                            stroke: "#111",
                            "stroke-width": "2px",
                            fill: "none"
                        }), r = m.Qd("text", {
                            x: x,
                            y: p / 2 + 20,
                            "font-family": "Arial",
                            "font-size": "14px",
                            fill: "#000",
                            "text-anchor": "middle",
                            "alignment-baseline": "central"
                        }), x = m.Qd("text", {
                            x: x,
                            y: p / 2 + 40,
                            "font-family": "Arial",
                            "font-weight": "bold",
                            "font-size": "16px",
                            fill: "#000",
                            "text-anchor": "middle",
                            "alignment-baseline": "central"
                        }), r.appendChild(B.createTextNode(m.Mc.Xc[D]())),
                        x.appendChild(B.createTextNode(m.Rd(A[D]))), q.appendChild(h), q.appendChild(r), q.appendChild(x));
                    m.table(a, A, b, c);
                    var S = d.a(0);
                    S.style.cssText = "position: absolute; width: 100%; height: 50%; left: 0; top: 0; opacity: 0; background: url(" + m.Mc.eg + m.Mc.rd + ")";
                    var T = S.cloneNode(!0);
                    T.style.background = "url(" + m.Mc.eg + m.Mc.qd + ")";
                    g.appendChild(S);
                    g.appendChild(T);
                    var N = d.a("img");
                    N.style.cssText = "position: absolute; margin: -16px;";
                    a == m.Le ? N.src = m.Mc.eg + m.Mc.sun : a == m.Xh && (a = m.Mc.Ri.length, N.src = m.Mc.eg + m.Mc.Ri[(la.Nf(new Date(+m.time)).xg *
                        a + a - .5) % a | 0]);
                    g.appendChild(N);
                    var na = [n.ua, n.va, n.ta, n.ya, n.xa, n.za, n.Aa, n.wa];
                    m.yg.push(f);
                    g.appendChild(q)
                }
            },
            Rd: function(a) {
                return "string" == typeof a ? a : a ? (a.getHours() + 100 + "").slice(1) + ":" + (a.getMinutes() + 100 + "").slice(1) + (m.Mc.Il ? ":" + (a.getSeconds() + 100 + "").slice(1) : "") : "&mdash;"
            },
            bh: function(a) {
                return a ? a.format(n.s) : "&mdash;"
            },
            dh: function(a) {
                return k.round(100 * a) + " %"
            },
            Pe: function(a, b) {
                (d.Qc(a) || {}).innerHTML = b
            },
            color: function(a) {
                return /^\#[0-9A-F]{3}$/i.test(a) ? (a = parseInt(a.substr(1), 16), [17 *
                    (a / 16 / 16 | 0), 17 * (a / 16 % 16 | 0), a % 16 * 17
                ]) : /^\#[0-9A-F]{6}$/i.test(a) ? (a = parseInt(a.substr(1), 16), [a / 256 / 256 | 0, a / 256 % 256 | 0, a % 256]) : /^rgb?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(a) ? (a = a.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i), [parseInt(a[1] || 10), parseInt(a[2] || 10), parseInt(a[3] || 10)]) : [0, 0, 0]
            },
            ei: function(a, b, c) {
                return a * (1 - c) + b * c
            },
            ni: function(a, b, c) {
                return "rgb(" + k.floor(a[0] * (1 - c) + b[0] * c) + ", " + k.floor(a[1] * (1 - c) + b[1] * c) + ", " + k.floor(a[2] * (1 - c) + b[2] * c) + ")"
            },
            getTimezoneOffset: function(a) {
                var b =
                    m.Mc.Td;
                if ("undefined" != typeof b.Vi) return b.Vi;
                var c = new Date(a),
                    d = c.getUTCFullYear();
                c.setUTCMonth(b.ik, 7);
                c.setUTCMonth(b.ik, (7 + b.Dl - 1) % 7 + 1 - c.getUTCDay() + 7 * b.El);
                c.setUTCFullYear(d);
                if (a < c) return b.Fj;
                c.setUTCMonth(b.Ej, 7);
                c.setUTCMonth(b.Ej, (7 + b.yl - 1) % 7 + 1 - c.getUTCDay() + 7 * b.zl);
                c.setUTCFullYear(d);
                return a < c ? b.Fl : b.Fj
            }
        };
    (function() {
        function a(a, b, d) {
            a["get" + b] = function() {
                return Date.prototype["getUTC" + b].apply(new Date(+this + d), arguments)
            };
            a["set" + b] = function() {
                return this.setTime(Date.prototype["setUTC" +
                    b].apply(new Date(+this + d), arguments) - d)
            }
        }
        var b = "FullYear Month Date Day Hours Minutes Seconds Milliseconds".split(" ");
        Date.prototype.Be = function(c) {
            for (var d = 0; d < b.length; d++) a(this, b[d], 6E4 * c)
        }
    })();
    m.Mc = {
        eg: qa + "images/astro/",
        sun: "slunce.png",
        Ri: "0.png 1.png 2.png 3.png 4.png 5.png 6.png 7.png 8.png 9.png 10.png 11.png 12.png 13.png 14.png 15.png 16.png 17.png 18.png 19.png 20.png 21.png 22.png 23.png 24.png 25.png 26.png 27.png 28.png 29.png 30.png".split(" "),
        rd: "hvezdy.png",
        qd: "vesmir.png",
        aa: {
            3: {
                top: "#1288CC",
                bottom: "#B4D4E9",
                rd: 0,
                qd: 0
            },
            "-3": {
                top: "#0072B5",
                bottom: "#67A9D3",
                rd: 0,
                qd: 0
            },
            "-9": {
                top: "#00395A",
                bottom: "#3481B2",
                rd: .5,
                qd: 0
            },
            "-15": {
                top: "#00395A",
                bottom: "#0072B5",
                rd: 1,
                qd: .2
            },
            "-21": {
                top: "#000000",
                bottom: "#000000",
                rd: 1,
                qd: .5
            },
            "-60": {
                top: "#000000",
                bottom: "#000000",
                rd: 1,
                qd: 1
            }
        },
        Xc: {
            solarNoon: function() {
                return n.la
            },
            rise: function() {
                return n.ra
            },
            set: function() {
                return n.sa
            }
        },
        ye: [{
            label: function() {
                return n.qa
            },
            color: "#aaaaaa"
        }, {
            label: function() {
                return n.ma
            },
            color: "#cccccc"
        }, {
            label: function() {
                return n.pa
            },
            color: "#d0dce5"
        }, {
            label: function() {
                return n.na
            },
            color: "#d7eaf6"
        }, {
            label: function() {
                return n.oa
            },
            color: "#fdedd0"
        }]
    };
    var la = function() {
            function a(a) {
                return new Date(864E5 * (a + .5 - 2440588))
            }

            function b(a, b) {
                return u(p(a) * q(B) - r(b) * p(B), q(a))
            }

            function c(a, b) {
                return t(p(b) * q(B) + q(b) * p(B) * p(a))
            }

            function d(a, b, c) {
                return u(p(a), q(a) * p(b) - r(c) * q(b))
            }

            function e(a, b, c) {
                return t(p(b) * p(c) + q(b) * q(c) * q(a))
            }

            function g(a) {
                var b = w * (1.9148 * p(a) + .02 * p(2 * a) + 3E-4 * p(3 * a));
                return a + b + 102.9372 * w + m
            }

            function h(a) {
                a = g(w * (357.5291 +
                    .98560028 * a));
                return {
                    td: c(a, 0),
                    ke: b(a, 0)
                }
            }

            function l(a) {
                var d = w * (134.963 + 13.064993 * a),
                    e = w * (93.272 + 13.22935 * a);
                a = w * (218.316 + 13.176396 * a) + 6.289 * w * p(d);
                e = 5.128 * w * p(e);
                d = 385001 - 20905 * q(d);
                return {
                    ke: b(a, e),
                    td: c(a, e),
                    wi: d
                }
            }

            function n(a, b) {
                return new Date(a.valueOf() + 864E5 * b / 24)
            }
            var m = k.PI,
                p = k.sin,
                q = k.cos,
                r = k.tan,
                t = k.asin,
                u = k.atan2,
                z = k.acos,
                w = m / 180,
                B = 23.4397 * w,
                A = {
                    Ci: function(a, b, c) {
                        c = w * -c;
                        b = w * b;
                        var g = a.valueOf() / 864E5 - .5 + 2440588 - 2451545;
                        a = h(g);
                        c = w * (280.16 + 360.9856235 * g) - c - a.ke;
                        return {
                            azimuth: d(c, b, a.td),
                            altitude: e(c, b, a.td)
                        }
                    }
                },
                C = A.Xc = [
                    [-.833, "sunrise", "sunset"],
                    [-.3, "sunriseEnd", "sunsetStart"],
                    [-6, "dawn", "dusk"],
                    [-12, "nauticalDawn", "nauticalDusk"],
                    [-18, "nightEnd", "night"],
                    [6, "goldenHourEnd", "goldenHour"]
                ];
            A.Bj = function() {
                C.push([-.833, "rise", "set"])
            };
            A.nk = function(b, d, e) {
                e = w * -e;
                d = w * d;
                b = k.round(b.valueOf() / 864E5 - .5 + 2440588 - 2451545 - 9E-4 - e / (2 * m));
                var f = 9E-4 + (0 + e) / (2 * m) + b,
                    h = w * (357.5291 + .98560028 * f),
                    l = g(h),
                    n = c(l, 0),
                    f = 2451545 + f + .0053 * p(h) - .0069 * p(2 * l),
                    r, t, u, v, x, A = {
                        Jl: a(f),
                        Gl: a(f - .5)
                    };
                r = 0;
                for (t = C.length; r <
                    t; r += 1) {
                    u = C[r];
                    v = e;
                    x = b;
                    var B = h,
                        E = l,
                        D;
                    D = d;
                    var F = n;
                    D = z((p(u[0] * w) - p(D) * p(F)) / (q(D) * q(F)));
                    v = 2451545 + (9E-4 + (D + v) / (2 * m) + x) + .0053 * p(B) - .0069 * p(2 * E);
                    x = f - (v - f);
                    A[u[1]] = a(x);
                    A[u[2]] = a(v)
                }
                return A
            };
            A.og = function(a, b, c) {
                c = w * -c;
                b = w * b;
                var g = a.valueOf() / 864E5 - .5 + 2440588 - 2451545;
                a = l(g);
                c = w * (280.16 + 360.9856235 * g) - c - a.ke;
                g = e(c, b, a.td);
                g += .017 * w / r(g + 10.26 * w / (g + 5.1 * w));
                return {
                    azimuth: d(c, b, a.td),
                    altitude: g,
                    Bl: a.wi
                }
            };
            A.Nf = function(a) {
                var b = a.valueOf() / 864E5 - .5 + 2440588 - 2451545;
                a = h(b);
                var b = l(b),
                    c = z(p(a.td) * p(b.td) + q(a.td) *
                        q(b.td) * q(a.ke - b.ke)),
                    c = u(149598E3 * p(c), b.wi - 149598E3 * q(c));
                a = u(q(a.td) * p(a.ke - b.ke), p(a.td) * q(b.td) - q(a.td) * p(b.td) * q(a.ke - b.ke));
                return {
                    Mf: (1 + q(c)) / 2,
                    xg: .5 + .5 * c * (0 > a ? -1 : 1) / k.PI,
                    Bf: a
                }
            };
            A.Of = function(a, b, c) {
                a = new Date(a);
                a.setHours(0);
                a.setMinutes(0);
                a.setSeconds(0);
                a.setMilliseconds(0);
                for (var d = .133 * w, e = A.og(a, b, c).altitude - d, f, g, h, l, m, p, q, r, t, u, v = 1; 24 >= v; v += 2) {
                    f = A.og(n(a, v), b, c).altitude - d;
                    g = A.og(n(a, v + 1), b, c).altitude - d;
                    m = (e + g) / 2 - f;
                    p = (g - e) / 2;
                    q = -p / (2 * m);
                    r = (m * q + p) * q + f;
                    p = p * p - 4 * m * f;
                    f = 0;
                    0 <= p && (u = k.sqrt(p) /
                        (2 * k.abs(m)), t = q - u, u = q + u, 1 >= k.abs(t) && f++, 1 >= k.abs(u) && f++, -1 > t && (t = u));
                    1 === f ? 0 > e ? h = v + t : l = v + t : 2 === f && (h = v + (0 > r ? u : t), l = v + (0 > r ? t : u));
                    if (h && l) break;
                    e = g
                }
                b = {};
                h && (b.rise = n(a, h));
                l && (b.set = n(a, l));
                h || l || (b[0 < r ? "alwaysUp" : "alwaysDown"] = !0);
                return b
            };
            return A
        }(),
        Oa = function() {
            function a(a) {
                return a - 360 * k.floor(a / 360)
            }

            function b(a) {
                return k.sin(a * k.PI / 180)
            }

            function c(a) {
                return k.cos(a * k.PI / 180)
            }

            function d(a, b) {
                return 180 / k.PI * k.atan(a / b) - 180 * (0 > b)
            }

            function e(g, h, l, n, m, p, q, r) {
                p = a(98.9818 + .985647352 * (367 * l -
                    k.floor(7 * (l + k.floor((n + 9) / 12)) / 4) + k.floor(275 * n / 9) + m - 730530 + p / 24) + 15 * p + r) / 15;
                l = c(15 * (p - g)) * c(h);
                n = b(h);
                m = l * b(q) - n * c(q);
                g = b(15 * (p - g)) * c(h);
                return [d(l * c(q) + n * b(q), k.sqrt(m * m + g * g)), a(d(g, m) + 180)]
            }

            function g(e, v, y, A) {
                e = 367 * e - k.floor(7 * (e + k.floor((v + 9) / 12)) / 4) + k.floor(275 * v / 9) + y - 730530 + A / 24 + 2451543.5;
                v = (e - 2451545) / 36525;
                var B = v * v,
                    C = B * v,
                    D = C * v;
                y = 218.3164477 + 481267.88123421 * v - .0015786 * B + C / 538841 - D / 65194E3;
                A = 297.8501921 + 445267.1114034 * v - .0018819 * B + C / 545868 - D / 113065E3;
                for (var E = 357.5291092 + 35999.0502909 * v -
                        1.536E-4 * B + C / 2449E4, F = 134.9633964 + 477198.8675055 * v + .0087414 * B + C / 69699 - D / 14712E3, C = 93.272095 + 483202.0175233 * v - .0036539 * B - C / 3526E3 + D / 86331E4, D = 119.75 + 131.849 * v, H = 1 - .002516 * v - 7.4E-6 * B, J = H * H, I = 0, Q = B = 0; 60 > Q; Q++) {
                    var K = 1;
                    1 == k.abs(l[Q]) && (K = H);
                    2 == k.abs(l[Q]) && (K = J);
                    I += p[Q] * K * b(a(h[Q] * A + l[Q] * E + n[Q] * F + m[Q] * C));
                    B += q[Q] * K * c(a(h[Q] * A + l[Q] * E + n[Q] * F + m[Q] * C))
                }
                for (var L = 0, Q = 0; 60 > Q; Q++) K = 1, 1 == k.abs(t[Q]) && (K = H), 2 == k.abs(t[Q]) && (K = J), L += w[Q] * K * b(a(r[Q] * A + t[Q] * E + u[Q] * F + z[Q] * C));
                I = I + 3958 * b(a(D)) + 1962 * b(a(y - C)) + 318 * b(a(53.09 +
                    479264.29 * v));
                L = L - 2235 * b(a(y)) + 382 * b(a(313.45 + 481266.484 * v)) + 175 * b(a(D - C)) + 175 * b(a(D + C)) + 127 * b(a(y - F)) - 115 * b(a(y + F));
                v = a(y + I / 1E6);
                y = a(L / 1E6);
                180 < y && (y = y - 360);
                A = k.round(385000.56 + B / 1E3);
                E = 23.4393 - 3.563E-9 * (e - 2451543.5);
                e = a(d(b(v) * c(E) - k.tan(y * k.PI / 180) * b(E), c(v))) / 15;
                v = a(180 / k.PI * k.asin(b(y) * c(E) + c(y) * b(E) * b(v)));
                180 < v && (v = v - 360);
                return [e, v, A]
            }
            var h = [0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 1, 0, 2, 0, 0, 4, 0, 4, 2, 2, 1, 1, 2, 2, 4, 2, 0, 2, 2, 1, 2, 0, 0, 2, 2, 2, 4, 0, 3, 2, 4, 0, 2, 2, 2, 4, 0, 4, 1, 2, 0, 1, 3, 4, 2, 0, 1, 2, 2],
                l = [0, 0, 0, 0, 1, 0, 0, -1, 0, -1, 1, 0,
                    1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, -1, 0, 0, 0, 1, 0, -1, 0, -2, 1, 2, -2, 0, 0, -1, 0, 0, 1, -1, 2, 2, 1, -1, 0, 0, -1, 0, 1, 0, 1, 0, 0, -1, 2, 1, 0, 0
                ],
                n = [1, -1, 0, 2, 0, 0, -2, -1, 1, 0, -1, 0, 1, 0, 1, 1, -1, 3, -2, -1, 0, -1, 0, 1, 2, 0, -3, -2, -1, -2, 1, 0, 2, 0, -1, 1, 0, -1, 2, -1, 1, -2, -1, -1, -2, 0, 1, 4, 0, -2, 0, 2, 1, -2, -3, 2, 1, -1, 3, -1],
                m = [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, -2, 2, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, -2, 2, 0, 2, 0, 0, 0, 0, 0, 0, -2, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, 0, -2],
                p = [6288774, 1274027, 658314, 213618, -185116, -114332, 58793, 57066, 53322, 45758, -40923, -34720, -30383, 15327, -12528, 10980, 10675,
                    10034, 8548, -7888, -6766, -5163, 4987, 4036, 3994, 3861, 3665, -2689, -2602, 2390, -2348, 2236, -2120, -2069, 2048, -1773, -1595, 1215, -1110, -892, -810, 759, -713, -700, 691, 596, 549, 537, 520, -487, -399, -381, 351, -340, 330, 327, -323, 299, 294, 0
                ],
                q = [-20905355, -3699111, -2955968, -569925, 48888, -3149, 246158, -152138, -170733, -204586, -129620, 108743, 104755, 10321, 0, 79661, -34782, -23210, -21636, 24208, 30824, -8379, -16675, -12831, -10445, -11650, 14403, -7003, 0, 10056, 6322, -9884, 5751, 0, -4950, 4130, 0, -3958, 0, 3258, 2616, -1897, -2117, 2354, 0, 0, -1423, -1117, -1571, -1739, 0, -4421, 0, 0, 0, 0, 1165, 0, 0, 8752],
                r = [0, 0, 0, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 4, 0, 0, 0, 1, 0, 0, 0, 1, 0, 4, 4, 0, 4, 2, 2, 2, 2, 0, 2, 2, 2, 2, 4, 2, 2, 0, 2, 1, 1, 0, 2, 1, 2, 0, 4, 4, 1, 4, 1, 4, 2],
                t = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 1, -1, -1, -1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 1, 0, -1, -2, 0, 1, 1, 1, 1, 1, 0, -1, 1, 0, -1, 0, 0, 0, -1, -2],
                u = [0, 1, 1, 0, -1, -1, 0, 2, 1, 2, 0, -2, 1, 0, -1, 0, -1, -1, -1, 0, 0, -1, 0, 1, 1, 0, 0, 3, 0, -1, 1, -2, 0, 2, 1, -2, 3, 2, -3, -1, 0, 0, 1, 0, 1, 1, 0, 0, -2, -1, 1, -2, 2, -2, -1, 1, 1, -1, 0, 0],
                z = [1, 1, -1, -1, 1, -1, 1, 1, -1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 3,
                    1, 1, 1, -1, -1, -1, 1, -1, 1, -3, 1, -3, -1, -1, 1, -1, 1, -1, 1, 1, 1, 1, -1, 3, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1
                ],
                w = [5128122, 280602, 277693, 173237, 55413, 46271, 32573, 17198, 9266, 8822, 8216, 4324, 4200, -3359, 2463, 2211, 2065, -1870, 1828, -1794, -1749, -1565, -1491, -1475, -1410, -1344, -1335, 1107, 1021, 833, 777, 671, 607, 596, 491, -451, 439, 422, 421, -366, -351, 331, 315, 302, -283, -229, 223, 223, -220, -220, -185, 181, -177, 176, 166, -164, 132, -119, 115, 107];
            return {
                Of: function(a, b, c) {
                    for (var d = a.getFullYear(), f = a.getMonth() + 1, h = a.getDate(), l = 0, n = [], m = [], p = [], q = 0; 24 >= q; q++) p[q] = !1;
                    var r = g(d, f, h, l - 0),
                        r = e(r[0], r[1], d, f, h, l - 0, b, c);
                    m[0] = r[0];
                    p[0] = !0;
                    n = 0 < m[0] ? [-2, -2] : [-1, -1];
                    l = 24;
                    r = g(d, f, h, l - 0);
                    r = e(r[0], r[1], d, f, h, l - 0, b, c);
                    m[24] = r[0];
                    p[24] = !0;
                    for (var t = 0; 2 > t; t++) {
                        for (var u = !1, w = 0, x = 24; 1 < k.ceil((x - w) / 2);)
                            if (q = w + k.round((x - w) / 2), p[q] || (l = q, r = g(d, f, h, l - 0), r = e(r[0], r[1], d, f, h, l - 0, b, c), m[q] = r[0], p[q] = !0), 0 == t && 0 >= m[w] && 0 <= m[q] || 1 == t && 0 <= m[w] && 0 >= m[q]) x = q, u = !0;
                            else if (0 == t && 0 >= m[q] && 0 <= m[x] || 1 == t && 0 <= m[q] && 0 >= m[x]) w = q, u = !0;
                        else break;
                        if (1 < x - w)
                            for (q = w; q < x; q++)
                                if (u = !1, p[q + 1] || (l = q + 1, r = g(d, f, h, l - 0), r = e(r[0], r[1], d, f, h, l - 0, b, c), m[l] = r[0], p[l] = !0), 0 == t && 0 >= m[q] && 0 <= m[q + 1] || 1 == t && 0 <= m[q] && 0 >= m[q + 1]) {
                                    w = q;
                                    x = q + 1;
                                    u = !0;
                                    break
                                }
                        u && (u = m[w], q = m[x], l = w + .5, r = g(d, f, h, l - 0), r = e(r[0], r[1], d, f, h, l - 0, b, c), 0 == t && 0 >= r[0] && (w = l, u = r[0]), 0 == t && 0 < r[0] && (x = l, q = r[0]), 1 == t && 0 >= r[0] && (x = l, q = r[0]), 1 == t && 0 < r[0] && (w = l, u = r[0]), n[t] = w + (x - w) * k.abs(u) / (k.abs(u) + k.abs(q)))
                    }
                    b = n;
                    c = new Date(a);
                    a = new Date(a);
                    c.setUTCHours(0, 0, 3600 * b[0], 0);
                    a.setUTCHours(0, 0, 3600 * b[1], 0);
                    return {
                        rise: -1 < b[0] ? c : void 0,
                        set: -1 <
                            b[1] ? a : void 0
                    }
                }
            }
        }()
}(window, document, MapOptions, Math);