import{$ as he,$a as Ee,Ac as De,Bb as T,Bc as Ae,C as ue,Ca as b,Da as D,Ea as _,Fb as ke,Ga as ne,Ha as L,I as ee,Jb as K,Jc as Te,Lb as Pe,Lc as Oe,Mb as O,Mc as V,Nb as X,Oa as p,Pa as z,Q as k,Qb as Y,Ra as B,Rc as Ie,S as f,Sb as M,Sc as He,Tb as I,U as s,Uc as Ne,Va as g,Wa as r,Wc as Fe,Xa as a,Xc as Re,Y as P,Ya as te,Yb as Se,Z as S,Za as Q,_ as F,_a as ie,ba as fe,cb as q,d as W,db as ae,ea as x,fa as xe,fb as u,g as H,hb as m,ia as _e,ib as re,jb as y,jd as ze,ka as j,kb as oe,l as me,la as ve,lb as U,ld as Be,mb as w,md as Ve,na as R,nb as C,nc as $,oa as be,od as We,pd as je,qd as Le,rb as G,sa as d,sb as A,tb as h,ub as Me,va as ye,vb as o,wb as Z,wc as J,wd as Qe,x as ge,xa as we,xb as E,xd as qe,y as N,yd as Ue,za as Ce,zd as Ge}from"./chunk-CY7QLLBC.js";var rn=["determinateSpinner"];function on(t,v){if(t&1&&(F(),r(0,"svg",11),te(1,"circle",12),a()),t&2){let e=m();p("viewBox",e._viewBox()),d(),A("stroke-dasharray",e._strokeCircumference(),"px")("stroke-dashoffset",e._strokeCircumference()/2,"px")("stroke-width",e._circleStrokeWidth(),"%"),p("r",e._circleRadius())}}var sn=new f("mat-progress-spinner-default-options",{providedIn:"root",factory:()=>({diameter:Ze})}),Ze=100,dn=10,Hn=(()=>{class t{_elementRef=s(R);_noopAnimations;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;_defaultColor="primary";_determinateCircle;constructor(){let e=s(sn),n=Ie(),i=this._elementRef.nativeElement;this._noopAnimations=n==="di-disabled"&&!!e&&!e._forceAnimations,this.mode=i.nodeName.toLowerCase()==="mat-spinner"?"indeterminate":"determinate",!this._noopAnimations&&n==="reduced-motion"&&i.classList.add("mat-progress-spinner-reduced-motion"),e&&(e.color&&(this.color=this._defaultColor=e.color),e.diameter&&(this.diameter=e.diameter),e.strokeWidth&&(this.strokeWidth=e.strokeWidth))}mode;get value(){return this.mode==="determinate"?this._value:0}set value(e){this._value=Math.max(0,Math.min(100,e||0))}_value=0;get diameter(){return this._diameter}set diameter(e){this._diameter=e||0}_diameter=Ze;get strokeWidth(){return this._strokeWidth??this.diameter/10}set strokeWidth(e){this._strokeWidth=e||0}_strokeWidth;_circleRadius(){return(this.diameter-dn)/2}_viewBox(){let e=this._circleRadius()*2+this.strokeWidth;return`0 0 ${e} ${e}`}_strokeCircumference(){return 2*Math.PI*this._circleRadius()}_strokeDashOffset(){return this.mode==="determinate"?this._strokeCircumference()*(100-this._value)/100:null}_circleStrokeWidth(){return this.strokeWidth/this.diameter*100}static \u0275fac=function(n){return new(n||t)};static \u0275cmp=b({type:t,selectors:[["mat-progress-spinner"],["mat-spinner"]],viewQuery:function(n,i){if(n&1&&U(rn,5),n&2){let c;w(c=C())&&(i._determinateCircle=c.first)}},hostAttrs:["role","progressbar","tabindex","-1",1,"mat-mdc-progress-spinner","mdc-circular-progress"],hostVars:18,hostBindings:function(n,i){n&2&&(p("aria-valuemin",0)("aria-valuemax",100)("aria-valuenow",i.mode==="determinate"?i.value:null)("mode",i.mode),Me("mat-"+i.color),A("width",i.diameter,"px")("height",i.diameter,"px")("--mat-progress-spinner-size",i.diameter+"px")("--mat-progress-spinner-active-indicator-width",i.diameter+"px"),h("_mat-animation-noopable",i._noopAnimations)("mdc-circular-progress--indeterminate",i.mode==="indeterminate"))},inputs:{color:"color",mode:"mode",value:[2,"value","value",I],diameter:[2,"diameter","diameter",I],strokeWidth:[2,"strokeWidth","strokeWidth",I]},exportAs:["matProgressSpinner"],decls:14,vars:11,consts:[["circle",""],["determinateSpinner",""],["aria-hidden","true",1,"mdc-circular-progress__determinate-container"],["xmlns","http://www.w3.org/2000/svg","focusable","false",1,"mdc-circular-progress__determinate-circle-graphic"],["cx","50%","cy","50%",1,"mdc-circular-progress__determinate-circle"],["aria-hidden","true",1,"mdc-circular-progress__indeterminate-container"],[1,"mdc-circular-progress__spinner-layer"],[1,"mdc-circular-progress__circle-clipper","mdc-circular-progress__circle-left"],[3,"ngTemplateOutlet"],[1,"mdc-circular-progress__gap-patch"],[1,"mdc-circular-progress__circle-clipper","mdc-circular-progress__circle-right"],["xmlns","http://www.w3.org/2000/svg","focusable","false",1,"mdc-circular-progress__indeterminate-circle-graphic"],["cx","50%","cy","50%"]],template:function(n,i){if(n&1&&(L(0,on,2,8,"ng-template",null,0,ke),r(2,"div",2,1),F(),r(4,"svg",3),te(5,"circle",4),a()(),he(),r(6,"div",5)(7,"div",6)(8,"div",7),q(9,8),a(),r(10,"div",9),q(11,8),a(),r(12,"div",10),q(13,8),a()()()),n&2){let c=G(1);d(4),p("viewBox",i._viewBox()),d(),A("stroke-dasharray",i._strokeCircumference(),"px")("stroke-dashoffset",i._strokeDashOffset(),"px")("stroke-width",i._circleStrokeWidth(),"%"),p("r",i._circleRadius()),d(4),g("ngTemplateOutlet",c),d(2),g("ngTemplateOutlet",c),d(2),g("ngTemplateOutlet",c)}},dependencies:[Se],styles:[`.mat-mdc-progress-spinner {
  --mat-progress-spinner-animation-multiplier: 1;
  display: block;
  overflow: hidden;
  line-height: 0;
  position: relative;
  direction: ltr;
  transition: opacity 250ms cubic-bezier(0.4, 0, 0.6, 1);
}
.mat-mdc-progress-spinner circle {
  stroke-width: var(--mat-progress-spinner-active-indicator-width, 4px);
}
.mat-mdc-progress-spinner._mat-animation-noopable, .mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__determinate-circle {
  transition: none !important;
}
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-circle-graphic,
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__spinner-layer,
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-container {
  animation: none !important;
}
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-container circle {
  stroke-dasharray: 0 !important;
}
@media (forced-colors: active) {
  .mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic,
  .mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle {
    stroke: currentColor;
    stroke: CanvasText;
  }
}

.mat-progress-spinner-reduced-motion {
  --mat-progress-spinner-animation-multiplier: 1.25;
}

.mdc-circular-progress__determinate-container,
.mdc-circular-progress__indeterminate-circle-graphic,
.mdc-circular-progress__indeterminate-container,
.mdc-circular-progress__spinner-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.mdc-circular-progress__determinate-container {
  transform: rotate(-90deg);
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__determinate-container {
  opacity: 0;
}

.mdc-circular-progress__indeterminate-container {
  font-size: 0;
  letter-spacing: 0;
  white-space: nowrap;
  opacity: 0;
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__indeterminate-container {
  opacity: 1;
  animation: mdc-circular-progress-container-rotate calc(1568.2352941176ms * var(--mat-progress-spinner-animation-multiplier)) linear infinite;
}

.mdc-circular-progress__determinate-circle-graphic,
.mdc-circular-progress__indeterminate-circle-graphic {
  fill: transparent;
}

.mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle,
.mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic {
  stroke: var(--mat-progress-spinner-active-indicator-color, var(--mat-sys-primary));
}
@media (forced-colors: active) {
  .mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle,
  .mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic {
    stroke: CanvasText;
  }
}

.mdc-circular-progress__determinate-circle {
  transition: stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);
}

.mdc-circular-progress__gap-patch {
  position: absolute;
  top: 0;
  left: 47.5%;
  box-sizing: border-box;
  width: 5%;
  height: 100%;
  overflow: hidden;
}

.mdc-circular-progress__gap-patch .mdc-circular-progress__indeterminate-circle-graphic {
  left: -900%;
  width: 2000%;
  transform: rotate(180deg);
}
.mdc-circular-progress__circle-clipper .mdc-circular-progress__indeterminate-circle-graphic {
  width: 200%;
}
.mdc-circular-progress__circle-right .mdc-circular-progress__indeterminate-circle-graphic {
  left: -100%;
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__circle-left .mdc-circular-progress__indeterminate-circle-graphic {
  animation: mdc-circular-progress-left-spin calc(1333ms * var(--mat-progress-spinner-animation-multiplier)) cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__circle-right .mdc-circular-progress__indeterminate-circle-graphic {
  animation: mdc-circular-progress-right-spin calc(1333ms * var(--mat-progress-spinner-animation-multiplier)) cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.mdc-circular-progress__circle-clipper {
  display: inline-flex;
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;
}

.mdc-circular-progress--indeterminate .mdc-circular-progress__spinner-layer {
  animation: mdc-circular-progress-spinner-layer-rotate calc(5332ms * var(--mat-progress-spinner-animation-multiplier)) cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

@keyframes mdc-circular-progress-container-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes mdc-circular-progress-spinner-layer-rotate {
  12.5% {
    transform: rotate(135deg);
  }
  25% {
    transform: rotate(270deg);
  }
  37.5% {
    transform: rotate(405deg);
  }
  50% {
    transform: rotate(540deg);
  }
  62.5% {
    transform: rotate(675deg);
  }
  75% {
    transform: rotate(810deg);
  }
  87.5% {
    transform: rotate(945deg);
  }
  100% {
    transform: rotate(1080deg);
  }
}
@keyframes mdc-circular-progress-left-spin {
  from {
    transform: rotate(265deg);
  }
  50% {
    transform: rotate(130deg);
  }
  to {
    transform: rotate(265deg);
  }
}
@keyframes mdc-circular-progress-right-spin {
  from {
    transform: rotate(-265deg);
  }
  50% {
    transform: rotate(-130deg);
  }
  to {
    transform: rotate(-265deg);
  }
}
`],encapsulation:2,changeDetection:0})}return t})();var Nn=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=D({type:t});static \u0275inj=k({imports:[$]})}return t})();var de=new f("CdkAccordion"),Ke=(()=>{class t{_stateChanges=new H;_openCloseAllActions=new H;id=s(V).getId("cdk-accordion-");multi=!1;openAll(){this.multi&&this._openCloseAllActions.next(!0)}closeAll(){this._openCloseAllActions.next(!1)}ngOnChanges(e){this._stateChanges.next(e)}ngOnDestroy(){this._stateChanges.complete(),this._openCloseAllActions.complete()}static \u0275fac=function(n){return new(n||t)};static \u0275dir=_({type:t,selectors:[["cdk-accordion"],["","cdkAccordion",""]],inputs:{multi:[2,"multi","multi",M]},exportAs:["cdkAccordion"],features:[T([{provide:de,useExisting:t}]),j]})}return t})(),Xe=(()=>{class t{accordion=s(de,{optional:!0,skipSelf:!0});_changeDetectorRef=s(Y);_expansionDispatcher=s(J);_openCloseAllSubscription=W.EMPTY;closed=new x;opened=new x;destroyed=new x;expandedChange=new x;id=s(V).getId("cdk-accordion-child-");get expanded(){return this._expanded}set expanded(e){if(this._expanded!==e){if(this._expanded=e,this.expandedChange.emit(e),e){this.opened.emit();let n=this.accordion?this.accordion.id:this.id;this._expansionDispatcher.notify(this.id,n)}else this.closed.emit();this._changeDetectorRef.markForCheck()}}_expanded=!1;get disabled(){return this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=_e(!1);_removeUniqueSelectionListener=()=>{};constructor(){}ngOnInit(){this._removeUniqueSelectionListener=this._expansionDispatcher.listen((e,n)=>{this.accordion&&!this.accordion.multi&&this.accordion.id===n&&this.id!==e&&(this.expanded=!1)}),this.accordion&&(this._openCloseAllSubscription=this._subscribeToOpenCloseAllActions())}ngOnDestroy(){this.opened.complete(),this.closed.complete(),this.destroyed.emit(),this.destroyed.complete(),this._removeUniqueSelectionListener(),this._openCloseAllSubscription.unsubscribe()}toggle(){this.disabled||(this.expanded=!this.expanded)}close(){this.disabled||(this.expanded=!1)}open(){this.disabled||(this.expanded=!0)}_subscribeToOpenCloseAllActions(){return this.accordion._openCloseAllActions.subscribe(e=>{this.disabled||(this.expanded=e)})}static \u0275fac=function(n){return new(n||t)};static \u0275dir=_({type:t,selectors:[["cdk-accordion-item"],["","cdkAccordionItem",""]],inputs:{expanded:[2,"expanded","expanded",M],disabled:[2,"disabled","disabled",M]},outputs:{closed:"closed",opened:"opened",destroyed:"destroyed",expandedChange:"expandedChange"},exportAs:["cdkAccordionItem"],features:[T([{provide:de,useValue:void 0}])]})}return t})(),Ye=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=D({type:t});static \u0275inj=k({})}return t})();var pn=["body"],mn=["bodyWrapper"],gn=[[["mat-expansion-panel-header"]],"*",[["mat-action-row"]]],un=["mat-expansion-panel-header","*","mat-action-row"];function hn(t,v){}var fn=[[["mat-panel-title"]],[["mat-panel-description"]],"*"],xn=["mat-panel-title","mat-panel-description","*"];function _n(t,v){t&1&&(Q(0,"span",1),F(),Q(1,"svg",2),Ee(2,"path",3),ie()())}var ce=new f("MAT_ACCORDION"),$e=new f("MAT_EXPANSION_PANEL"),vn=(()=>{class t{_template=s(ye);_expansionPanel=s($e,{optional:!0});constructor(){}static \u0275fac=function(n){return new(n||t)};static \u0275dir=_({type:t,selectors:[["ng-template","matExpansionPanelContent",""]]})}return t})(),Je=new f("MAT_EXPANSION_PANEL_DEFAULT_OPTIONS"),le=(()=>{class t extends Xe{_viewContainerRef=s(Ce);_animationsDisabled=He();_document=s(fe);_ngZone=s(xe);_elementRef=s(R);_renderer=s(we);_cleanupTransitionEnd;get hideToggle(){return this._hideToggle||this.accordion&&this.accordion.hideToggle}set hideToggle(e){this._hideToggle=e}_hideToggle=!1;get togglePosition(){return this._togglePosition||this.accordion&&this.accordion.togglePosition}set togglePosition(e){this._togglePosition=e}_togglePosition;afterExpand=new x;afterCollapse=new x;_inputChanges=new H;accordion=s(ce,{optional:!0,skipSelf:!0});_lazyContent;_body;_bodyWrapper;_portal;_headerId=s(V).getId("mat-expansion-panel-header-");constructor(){super();let e=s(Je,{optional:!0});this._expansionDispatcher=s(J),e&&(this.hideToggle=e.hideToggle)}_hasSpacing(){return this.accordion?this.expanded&&this.accordion.displayMode==="default":!1}_getExpandedState(){return this.expanded?"expanded":"collapsed"}toggle(){this.expanded=!this.expanded}close(){this.expanded=!1}open(){this.expanded=!0}ngAfterContentInit(){this._lazyContent&&this._lazyContent._expansionPanel===this&&this.opened.pipe(ee(null),N(()=>this.expanded&&!this._portal),ue(1)).subscribe(()=>{this._portal=new Ne(this._lazyContent._template,this._viewContainerRef)}),this._setupAnimationEvents()}ngOnChanges(e){this._inputChanges.next(e)}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTransitionEnd?.(),this._inputChanges.complete()}_containsFocus(){if(this._body){let e=this._document.activeElement,n=this._body.nativeElement;return e===n||n.contains(e)}return!1}_transitionEndListener=({target:e,propertyName:n})=>{e===this._bodyWrapper?.nativeElement&&n==="grid-template-rows"&&this._ngZone.run(()=>{this.expanded?this.afterExpand.emit():this.afterCollapse.emit()})};_setupAnimationEvents(){this._ngZone.runOutsideAngular(()=>{this._animationsDisabled?(this.opened.subscribe(()=>this._ngZone.run(()=>this.afterExpand.emit())),this.closed.subscribe(()=>this._ngZone.run(()=>this.afterCollapse.emit()))):setTimeout(()=>{let e=this._elementRef.nativeElement;this._cleanupTransitionEnd=this._renderer.listen(e,"transitionend",this._transitionEndListener),e.classList.add("mat-expansion-panel-animations-enabled")},200)})}static \u0275fac=function(n){return new(n||t)};static \u0275cmp=b({type:t,selectors:[["mat-expansion-panel"]],contentQueries:function(n,i,c){if(n&1&&oe(c,vn,5),n&2){let l;w(l=C())&&(i._lazyContent=l.first)}},viewQuery:function(n,i){if(n&1&&U(pn,5)(mn,5),n&2){let c;w(c=C())&&(i._body=c.first),w(c=C())&&(i._bodyWrapper=c.first)}},hostAttrs:[1,"mat-expansion-panel"],hostVars:4,hostBindings:function(n,i){n&2&&h("mat-expanded",i.expanded)("mat-expansion-panel-spacing",i._hasSpacing())},inputs:{hideToggle:[2,"hideToggle","hideToggle",M],togglePosition:"togglePosition"},outputs:{afterExpand:"afterExpand",afterCollapse:"afterCollapse"},exportAs:["matExpansionPanel"],features:[T([{provide:ce,useValue:void 0},{provide:$e,useExisting:t}]),ne,j],ngContentSelectors:un,decls:9,vars:4,consts:[["bodyWrapper",""],["body",""],[1,"mat-expansion-panel-content-wrapper"],["role","region",1,"mat-expansion-panel-content",3,"id"],[1,"mat-expansion-panel-body"],[3,"cdkPortalOutlet"]],template:function(n,i){n&1&&(re(gn),y(0),r(1,"div",2,0)(3,"div",3,1)(5,"div",4),y(6,1),L(7,hn,0,0,"ng-template",5),a(),y(8,2),a()()),n&2&&(d(),p("inert",i.expanded?null:""),d(2),g("id",i.id),p("aria-labelledby",i._headerId),d(4),g("cdkPortalOutlet",i._portal))},dependencies:[Fe],styles:[`.mat-expansion-panel {
  box-sizing: content-box;
  display: block;
  margin: 0;
  overflow: hidden;
}
.mat-expansion-panel.mat-expansion-panel-animations-enabled {
  transition: margin 225ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel {
  position: relative;
  background: var(--mat-expansion-container-background-color, var(--mat-sys-surface));
  color: var(--mat-expansion-container-text-color, var(--mat-sys-on-surface));
  border-radius: var(--mat-expansion-container-shape, 12px);
}
.mat-expansion-panel:not([class*=mat-elevation-z]) {
  box-shadow: var(--mat-expansion-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
}
.mat-accordion .mat-expansion-panel:not(.mat-expanded), .mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing) {
  border-radius: 0;
}
.mat-accordion .mat-expansion-panel:first-of-type {
  border-top-right-radius: var(--mat-expansion-container-shape, 12px);
  border-top-left-radius: var(--mat-expansion-container-shape, 12px);
}
.mat-accordion .mat-expansion-panel:last-of-type {
  border-bottom-right-radius: var(--mat-expansion-container-shape, 12px);
  border-bottom-left-radius: var(--mat-expansion-container-shape, 12px);
}
@media (forced-colors: active) {
  .mat-expansion-panel {
    outline: solid 1px;
  }
}

.mat-expansion-panel-content-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  grid-template-columns: 100%;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-content-wrapper {
  transition: grid-template-rows 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
  grid-template-rows: 1fr;
}
@supports not (grid-template-rows: 0fr) {
  .mat-expansion-panel-content-wrapper {
    height: 0;
  }
  .mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
    height: auto;
  }
}
@media print {
  .mat-expansion-panel-content-wrapper {
    height: 0;
  }
  .mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
    height: auto;
  }
}

.mat-expansion-panel-content {
  display: flex;
  flex-direction: column;
  overflow: visible;
  min-height: 0;
  visibility: hidden;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-content {
  transition: visibility 190ms linear;
}
.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper > .mat-expansion-panel-content {
  visibility: visible;
}
.mat-expansion-panel-content {
  font-family: var(--mat-expansion-container-text-font, var(--mat-sys-body-large-font));
  font-size: var(--mat-expansion-container-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-expansion-container-text-weight, var(--mat-sys-body-large-weight));
  line-height: var(--mat-expansion-container-text-line-height, var(--mat-sys-body-large-line-height));
  letter-spacing: var(--mat-expansion-container-text-tracking, var(--mat-sys-body-large-tracking));
}

.mat-expansion-panel-body {
  padding: 0 24px 16px;
}

.mat-expansion-panel-spacing {
  margin: 16px 0;
}
.mat-accordion > .mat-expansion-panel-spacing:first-child, .mat-accordion > *:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing {
  margin-top: 0;
}
.mat-accordion > .mat-expansion-panel-spacing:last-child, .mat-accordion > *:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing {
  margin-bottom: 0;
}

.mat-action-row {
  border-top-style: solid;
  border-top-width: 1px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 16px 8px 16px 24px;
  border-top-color: var(--mat-expansion-actions-divider-color, var(--mat-sys-outline));
}
.mat-action-row .mat-button-base,
.mat-action-row .mat-mdc-button-base {
  margin-left: 8px;
}
[dir=rtl] .mat-action-row .mat-button-base,
[dir=rtl] .mat-action-row .mat-mdc-button-base {
  margin-left: 0;
  margin-right: 8px;
}
`],encapsulation:2,changeDetection:0})}return t})();var pe=(()=>{class t{panel=s(le,{host:!0});_element=s(R);_focusMonitor=s(De);_changeDetectorRef=s(Y);_parentChangeSubscription=W.EMPTY;constructor(){s(Ae).load(ze);let e=this.panel,n=s(Je,{optional:!0}),i=s(new Pe("tabindex"),{optional:!0}),c=e.accordion?e.accordion._stateChanges.pipe(N(l=>!!(l.hideToggle||l.togglePosition))):me;this.tabIndex=parseInt(i||"")||0,this._parentChangeSubscription=ge(e.opened,e.closed,c,e._inputChanges.pipe(N(l=>!!(l.hideToggle||l.disabled||l.togglePosition)))).subscribe(()=>this._changeDetectorRef.markForCheck()),e.closed.pipe(N(()=>e._containsFocus())).subscribe(()=>this._focusMonitor.focusVia(this._element,"program")),n&&(this.expandedHeight=n.expandedHeight,this.collapsedHeight=n.collapsedHeight)}expandedHeight;collapsedHeight;tabIndex=0;get disabled(){return this.panel.disabled}_toggle(){this.disabled||this.panel.toggle()}_isExpanded(){return this.panel.expanded}_getExpandedState(){return this.panel._getExpandedState()}_getPanelId(){return this.panel.id}_getTogglePosition(){return this.panel.togglePosition}_showToggle(){return!this.panel.hideToggle&&!this.panel.disabled}_getHeaderHeight(){let e=this._isExpanded();return e&&this.expandedHeight?this.expandedHeight:!e&&this.collapsedHeight?this.collapsedHeight:null}_keydown(e){switch(e.keyCode){case 32:case 13:Te(e)||(e.preventDefault(),this._toggle());break;default:this.panel.accordion&&this.panel.accordion._handleHeaderKeydown(e);return}}focus(e,n){e?this._focusMonitor.focusVia(this._element,e,n):this._element.nativeElement.focus(n)}ngAfterViewInit(){this._focusMonitor.monitor(this._element).subscribe(e=>{e&&this.panel.accordion&&this.panel.accordion._handleHeaderFocus(this)})}ngOnDestroy(){this._parentChangeSubscription.unsubscribe(),this._focusMonitor.stopMonitoring(this._element)}static \u0275fac=function(n){return new(n||t)};static \u0275cmp=b({type:t,selectors:[["mat-expansion-panel-header"]],hostAttrs:["role","button",1,"mat-expansion-panel-header","mat-focus-indicator"],hostVars:13,hostBindings:function(n,i){n&1&&u("click",function(){return i._toggle()})("keydown",function(l){return i._keydown(l)}),n&2&&(p("id",i.panel._headerId)("tabindex",i.disabled?-1:i.tabIndex)("aria-controls",i._getPanelId())("aria-expanded",i._isExpanded())("aria-disabled",i.panel.disabled),A("height",i._getHeaderHeight()),h("mat-expanded",i._isExpanded())("mat-expansion-toggle-indicator-after",i._getTogglePosition()==="after")("mat-expansion-toggle-indicator-before",i._getTogglePosition()==="before"))},inputs:{expandedHeight:"expandedHeight",collapsedHeight:"collapsedHeight",tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:I(e)]},ngContentSelectors:xn,decls:5,vars:3,consts:[[1,"mat-content"],[1,"mat-expansion-indicator"],["xmlns","http://www.w3.org/2000/svg","viewBox","0 -960 960 960","aria-hidden","true","focusable","false"],["d","M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"]],template:function(n,i){n&1&&(re(fn),Q(0,"span",0),y(1),y(2,1),y(3,2),ie(),z(4,_n,3,0,"span",1)),n&2&&(h("mat-content-hide-toggle",!i._showToggle()),d(4),B(i._showToggle()?4:-1))},styles:[`.mat-expansion-panel-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 24px;
  border-radius: inherit;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-header {
  transition: height 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel-header::before {
  border-radius: inherit;
}
.mat-expansion-panel-header {
  height: var(--mat-expansion-header-collapsed-state-height, 48px);
  font-family: var(--mat-expansion-header-text-font, var(--mat-sys-title-medium-font));
  font-size: var(--mat-expansion-header-text-size, var(--mat-sys-title-medium-size));
  font-weight: var(--mat-expansion-header-text-weight, var(--mat-sys-title-medium-weight));
  line-height: var(--mat-expansion-header-text-line-height, var(--mat-sys-title-medium-line-height));
  letter-spacing: var(--mat-expansion-header-text-tracking, var(--mat-sys-title-medium-tracking));
}
.mat-expansion-panel-header.mat-expanded {
  height: var(--mat-expansion-header-expanded-state-height, 64px);
}
.mat-expansion-panel-header[aria-disabled=true] {
  color: var(--mat-expansion-header-disabled-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-expansion-panel-header:not([aria-disabled=true]) {
  cursor: pointer;
}
.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover {
  background: var(--mat-expansion-header-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
@media (hover: none) {
  .mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover {
    background: var(--mat-expansion-container-background-color, var(--mat-sys-surface));
  }
}
.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-keyboard-focused, .mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-program-focused {
  background: var(--mat-expansion-header-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));
}
.mat-expansion-panel-header._mat-animation-noopable {
  transition: none;
}
.mat-expansion-panel-header:focus, .mat-expansion-panel-header:hover {
  outline: none;
}
.mat-expansion-panel-header.mat-expanded:focus, .mat-expansion-panel-header.mat-expanded:hover {
  background: inherit;
}
.mat-expansion-panel-header.mat-expansion-toggle-indicator-before {
  flex-direction: row-reverse;
}
.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator {
  margin: 0 16px 0 0;
}
[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator {
  margin: 0 0 0 16px;
}

.mat-content {
  display: flex;
  flex: 1;
  flex-direction: row;
  overflow: hidden;
}
.mat-content.mat-content-hide-toggle {
  margin-right: 8px;
}
[dir=rtl] .mat-content.mat-content-hide-toggle {
  margin-right: 0;
  margin-left: 8px;
}
.mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle {
  margin-left: 24px;
  margin-right: 0;
}
[dir=rtl] .mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle {
  margin-right: 24px;
  margin-left: 0;
}

.mat-expansion-panel-header-title {
  color: var(--mat-expansion-header-text-color, var(--mat-sys-on-surface));
}

.mat-expansion-panel-header-title,
.mat-expansion-panel-header-description {
  display: flex;
  flex-grow: 1;
  flex-basis: 0;
  margin-right: 16px;
  align-items: center;
}
[dir=rtl] .mat-expansion-panel-header-title,
[dir=rtl] .mat-expansion-panel-header-description {
  margin-right: 0;
  margin-left: 16px;
}
.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-title,
.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-description {
  color: inherit;
}

.mat-expansion-panel-header-description {
  flex-grow: 2;
  color: var(--mat-expansion-header-description-color, var(--mat-sys-on-surface-variant));
}

.mat-expansion-panel-animations-enabled .mat-expansion-indicator {
  transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel-header.mat-expanded .mat-expansion-indicator {
  transform: rotate(180deg);
}
.mat-expansion-indicator::after {
  border-style: solid;
  border-width: 0 2px 2px 0;
  content: "";
  padding: 3px;
  transform: rotate(45deg);
  vertical-align: middle;
  color: var(--mat-expansion-header-indicator-color, var(--mat-sys-on-surface-variant));
  display: var(--mat-expansion-legacy-header-indicator-display, none);
}
.mat-expansion-indicator svg {
  width: 24px;
  height: 24px;
  margin: 0 -8px;
  vertical-align: middle;
  fill: var(--mat-expansion-header-indicator-color, var(--mat-sys-on-surface-variant));
  display: var(--mat-expansion-header-indicator-display, inline-block);
}

@media (forced-colors: active) {
  .mat-expansion-panel-content {
    border-top: 1px solid;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
`],encapsulation:2,changeDetection:0})}return t})(),en=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275dir=_({type:t,selectors:[["mat-panel-description"]],hostAttrs:[1,"mat-expansion-panel-header-description"]})}return t})(),nn=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275dir=_({type:t,selectors:[["mat-panel-title"]],hostAttrs:[1,"mat-expansion-panel-header-title"]})}return t})(),ut=(()=>{class t extends Ke{_keyManager;_ownHeaders=new be;_headers;hideToggle=!1;displayMode="default";togglePosition="after";ngAfterContentInit(){this._headers.changes.pipe(ee(this._headers)).subscribe(e=>{this._ownHeaders.reset(e.filter(n=>n.panel.accordion===this)),this._ownHeaders.notifyOnChanges()}),this._keyManager=new Oe(this._ownHeaders).withWrap().withHomeAndEnd()}_handleHeaderKeydown(e){this._keyManager.onKeydown(e)}_handleHeaderFocus(e){this._keyManager.updateActiveItem(e)}ngOnDestroy(){super.ngOnDestroy(),this._keyManager?.destroy(),this._ownHeaders.destroy()}static \u0275fac=(()=>{let e;return function(i){return(e||(e=ve(t)))(i||t)}})();static \u0275dir=_({type:t,selectors:[["mat-accordion"]],contentQueries:function(n,i,c){if(n&1&&oe(c,pe,5),n&2){let l;w(l=C())&&(i._headers=l)}},hostAttrs:[1,"mat-accordion"],hostVars:2,hostBindings:function(n,i){n&2&&h("mat-accordion-multi",i.multi)},inputs:{hideToggle:[2,"hideToggle","hideToggle",M],displayMode:"displayMode",togglePosition:"togglePosition"},exportAs:["matAccordion"],features:[T([{provide:ce,useExisting:t}]),ne]})}return t})(),tn=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=D({type:t});static \u0275inj=k({imports:[Ye,Re,$]})}return t})();function yn(t,v){if(t&1&&(r(0,"span",4)(1,"mat-icon",10),o(2,"local_cafe"),a(),o(3),a()),t&2){let e=m();d(3),E(" ",e.pullCount()," ")}}function wn(t,v){if(t&1){let e=ae();r(0,"button",11),u("click",function(){P(e);let i=m();return S(i.newExtraction.emit(i.espresso()))}),r(1,"mat-icon"),o(2,"add_circle"),a(),o(3," Bezug "),a(),r(4,"div",12)(5,"button",13),u("click",function(){P(e);let i=m();return S(i.viewExtractions.emit(i.espresso()))}),r(6,"mat-icon"),o(7,"local_cafe"),a(),o(8),a(),r(9,"button",14),u("click",function(i){return i.stopPropagation()}),r(10,"mat-icon"),o(11,"more_vert"),a()(),r(12,"mat-menu",null,0)(14,"button",15),u("click",function(){P(e);let i=m();return S(i.edit.emit(i.espresso()))}),r(15,"mat-icon"),o(16,"edit"),a(),o(17," Umbenennen "),a(),r(18,"button",15),u("click",function(){P(e);let i=m();return S(i.archive.emit(i.espresso()))}),r(19,"mat-icon"),o(20,"archive"),a(),o(21," Archivieren "),a()()()}if(t&2){let e=G(13),n=m();d(8),E(" ",n.pullCount()," Bez\xFCge "),d(),g("matMenuTriggerFor",e)}}function Cn(t,v){if(t&1){let e=ae();r(0,"button",16),u("click",function(){P(e);let i=m();return S(i.restore.emit(i.espresso()))}),r(1,"mat-icon"),o(2,"unarchive"),a(),o(3," Wiederherstellen "),a()}}var an=class t{espresso=X.required();archived=X(!1);showPullCount=X(!0);newExtraction=O();viewExtractions=O();edit=O();archive=O();restore=O();pullCount=K(()=>this.espresso().espresso_pulls?.length??0);outputGrams=K(()=>(this.espresso().gramms*this.espresso().ratio).toFixed(0));ratioDisplay=K(()=>this.espresso().ratio.toFixed(1));static \u0275fac=function(e){return new(e||t)};static \u0275cmp=b({type:t,selectors:[["app-espresso-card"]],inputs:{espresso:[1,"espresso"],archived:[1,"archived"],showPullCount:[1,"showPullCount"]},outputs:{newExtraction:"newExtraction",viewExtractions:"viewExtractions",edit:"edit",archive:"archive",restore:"restore"},decls:48,vars:11,consts:[["moreMenu","matMenu"],[1,"espresso-panel"],[1,"espresso-header-desc"],[1,"espresso-vendor"],[1,"espresso-pull-badge"],[1,"espresso-details"],[1,"espresso-metrics"],[1,"metric"],[1,"espresso-actions"],["mat-flat-button","",1,"espresso-action-cta","espresso-action-restore"],[1,"pull-badge-icon"],["mat-flat-button","",1,"espresso-action-cta",3,"click"],[1,"espresso-secondary-row"],["mat-button","",1,"espresso-action-secondary",3,"click"],["mat-icon-button","","aria-label","Weitere Aktionen",1,"espresso-action-more",3,"click","matMenuTriggerFor"],["mat-menu-item","",3,"click"],["mat-flat-button","",1,"espresso-action-cta","espresso-action-restore",3,"click"]],template:function(e,n){e&1&&(r(0,"mat-expansion-panel",1)(1,"mat-expansion-panel-header")(2,"mat-panel-title"),o(3),a(),r(4,"mat-panel-description",2)(5,"span",3),o(6),a(),z(7,yn,4,1,"span",4),a()(),r(8,"div",5)(9,"div",6)(10,"div",7)(11,"mat-icon"),o(12,"settings"),a(),r(13,"span"),o(14),a(),r(15,"label"),o(16,"Mahlgrad"),a()(),r(17,"div",7)(18,"mat-icon"),o(19,"scale"),a(),r(20,"span"),o(21),a(),r(22,"label"),o(23,"Bohnen"),a()(),r(24,"div",7)(25,"mat-icon"),o(26,"timer"),a(),r(27,"span"),o(28),a(),r(29,"label"),o(30,"Bezug"),a()(),r(31,"div",7)(32,"mat-icon"),o(33,"double_arrow"),a(),r(34,"span"),o(35),a(),r(36,"label"),o(37,"Ratio"),a()(),r(38,"div",7)(39,"mat-icon"),o(40,"output"),a(),r(41,"span"),o(42),a(),r(43,"label"),o(44,"Output"),a()()(),r(45,"div",8),z(46,wn,22,2)(47,Cn,4,0,"button",9),a()()()),e&2&&(h("espresso-panel--archived",n.archived()),d(3),Z(n.espresso().name),d(3),Z(n.espresso().vendor),d(),B(n.showPullCount()?7:-1),d(7),Z(n.espresso().grinder_setting),d(7),E("",n.espresso().gramms,"g"),d(7),E("",n.espresso().runtime,"s"),d(7),E("1:",n.ratioDisplay()),d(7),E("",n.outputGrams(),"g"),d(4),B(n.archived()?47:46))},dependencies:[tn,le,pe,nn,en,Le,je,We,Ve,Be,Ge,qe,Qe,Ue],styles:["[_nghost-%COMP%]{display:block;margin-bottom:10px}.espresso-panel[_ngcontent-%COMP%]{background:var(--mat-sys-surface-container-low)}.espresso-panel--archived[_ngcontent-%COMP%]{opacity:.82}.espresso-header-desc[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;justify-content:space-between;flex:1;min-width:0;overflow:hidden}.espresso-vendor[_ngcontent-%COMP%]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0}.espresso-pull-badge[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:2px;font-size:.8rem;font-weight:600;color:var(--mat-sys-tertiary);white-space:nowrap;flex-shrink:0}.pull-badge-icon[_ngcontent-%COMP%]{font-size:14px;width:14px;height:14px;line-height:14px}.espresso-details[_ngcontent-%COMP%]{padding:12px 4px 4px;border-left:3px solid var(--cd-accent-crema);margin-left:4px}.espresso-panel--archived[_ngcontent-%COMP%]   .espresso-details[_ngcontent-%COMP%]{border-left-color:var(--mat-sys-outline-variant)}.espresso-metrics[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:10px}.metric[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;gap:2px;background:var(--mat-sys-surface-container);border-radius:10px;padding:6px 4px}.metric[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--mat-sys-tertiary);font-size:16px;width:16px;height:16px;line-height:16px}.metric[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-weight:700;font-size:.95rem;font-variant-numeric:tabular-nums;color:var(--mat-sys-on-surface);white-space:nowrap}.metric[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-size:.6rem;color:var(--mat-sys-on-surface-variant);text-transform:uppercase;letter-spacing:.04em;white-space:nowrap}.espresso-actions[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:8px;padding:0 0 4px}.espresso-action-cta[_ngcontent-%COMP%]{width:100%;height:44px;white-space:nowrap;--mdc-filled-button-container-color: var(--mat-sys-tertiary-container);--mdc-filled-button-label-text-color: var(--mat-sys-on-tertiary-container)}.espresso-action-restore[_ngcontent-%COMP%]{height:48px}.espresso-secondary-row[_ngcontent-%COMP%]{display:flex;align-items:center;gap:4px}.espresso-action-secondary[_ngcontent-%COMP%]{flex:1;height:40px;color:var(--mat-sys-on-surface-variant);white-space:nowrap}.espresso-action-more[_ngcontent-%COMP%]{color:var(--mat-sys-on-surface-variant);flex-shrink:0}"],changeDetection:0})};export{Hn as a,Nn as b,le as c,pe as d,nn as e,ut as f,tn as g,an as h};
