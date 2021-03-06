﻿import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { APIService } from '../API.service';
import { AuthService } from '../core/services/auth.service';
import { UserService } from '../users/services/users.service';
import { SlideItem } from './slides/slide.item';
import { SlideReferencesComponent } from './slides/reference-slide.component';
import { SlideExplanationRulesComponent } from './slides/rules-slide.component';
import { SlideTeaserComponent } from './slides/teaser-slide.component';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({ templateUrl: 'home.component.html', styleUrls: ['home.component.scss'] })
export class HomeComponent implements AfterViewInit, OnDestroy {
  public homeSlides = new Array<SlideItem>();
  currentSlideIndex = 0;

  @ViewChild('dynamicComponent', { read: ViewContainerRef }) container: ViewContainerRef;
  interval: any;
  pause = false;
  private subscription: Subscription;
  private componentRef: ComponentRef<SlideItem>;

  constructor(
    private authService: AuthService,
    private api: APIService,
    private userService: UserService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute
  ) {
    let hideTeaser = false;
    this.subscription = this.activatedRoute.data.subscribe((data) => {
      hideTeaser = data ? data.hideTeaser : false;
    });

    if (!hideTeaser) {
      this.homeSlides.push(new SlideItem(SlideTeaserComponent, 'Entdecke Welten...'));
    }
    this.homeSlides.push(new SlideItem(SlideExplanationRulesComponent, ''));
    if (!hideTeaser) {
      this.homeSlides.push(new SlideItem(SlideTeaserComponent, '...erschaffe Leben...'));
    }
    this.homeSlides.push(new SlideItem(SlideReferencesComponent, ''));
    if (!hideTeaser) {
      this.homeSlides.push(new SlideItem(SlideTeaserComponent, '...spiel das Spiel des Lebens'));
    }
  }

  ngAfterViewInit(): void {
    this.loadComponent();
    this.getSlides();
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.changeDetectorRef.detach();
    }
    clearInterval(this.interval);
    this.subscription.unsubscribe();
  }

  onPreviousClick(): void {
    this.currentSlideIndex = this.currentSlideIndex > 0 ? this.currentSlideIndex - 1 : this.homeSlides.length - 1;
    this.loadComponent();
  }

  onNextClick(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.homeSlides.length;
    this.loadComponent();
  }

  loadComponent(): void {
    const slideItem = this.homeSlides[this.currentSlideIndex];

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(slideItem.component);
    this.container.clear();
    this.componentRef = this.container.createComponent(componentFactory);
    this.componentRef.instance.data = slideItem.data;
    this.componentRef.changeDetectorRef.detectChanges();
  }

  getSlides(): void {
    this.interval = setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.homeSlides.length;
      this.loadComponent();
    }, 10000);
  }

  onTogglePauseClick(): void {
    this.pause = !this.pause;

    if (this.pause) {
      clearInterval(this.interval);
    } else {
      this.getSlides();
    }
  }
}
