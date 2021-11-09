---
title: Case Study - Kubernetes and Tremor Sidecars
tags:  [case-study, wayfair, k8s]
author: The Tremor Team
author_url: https://github.com/tremor-rs
author_image_url: https://avatars.githubusercontent.com/u/60009416?s=200&v=4
image: ./media/wayfair.png
draft: false
hide_table_of_contents: false
---

# Kubernetes and Tremor Sidecars

## Happened Before
  
The simplified architecture of our systems is currently:
  
![old pipeline](./media/kubernetes-sidecars/image1.png)

## Identified Need

Wayfair’s technology organization is continuously expanding, evolving
and growing. When work on tremor began we were running almost entirely
in our own data centres, on our own hardware.

Today, we are running largely in the cloud. Whether cloud-native or
bare-metal the sidecar pattern has proven to be a significantly popular
deployment pattern with tremor-based systems in production at Wayfair.  
  
Tremor is equally happy with clustered ( just a bunch of event
processors ) centralized deployments or with sidecar deployments; on
containerized virtual machines, or alongside our growing Kubernetes
estate.

With the rise of Kubernetes and cloud-native at Wayfair - we had an
interesting challenge as an infrastructure organization serving the
1000’s of developers in our wider technology group. How do we continue
to deliver a single pane of glass to our developers?  
  
Although the over-simplified architecture diagram above looks simple -
its far more complex in practice. We have multiple independent search
and visualization clusters. And we have many more infrastructure
services and clusters sitting behind these frontends.  
  
For our application developers - this looks like a vanilla installation
of ElasticSearch and Kibana. In reality its an always-changing and
forever-speciating set of services running 24x7x365 offering a
single-pane-of-glass for our developers convenience.  
  
By this state of use case evolution and adoption of Tremor at Wayfair -
tremor is at the centre of a lot of the internal data distribution and
processing - whilst offering no protocols, APIs or transports of its
own - entirely invisible to our target developer community.  
  
Our Kubernetes team developed helm charts for tremor to preserve the
convenience of this illusion; whilst accelerating the operationalisation
of our emergent cloud-native infrastructure services.

## Required Outcome

Boldly go cloud-native, in such a way that no-one truly notices.

### Characteristics

No new features or capabilities were developed for this use case by the
tremor team.

### Solution

Adopt helm-based deployments of tremor for our cloud-native and
kubernetes-enabled applications and services. The helm charts have since
been open sourced in collaboration with our Kubernetes Team as a part of
tremor, and have been extended to support OpenShift by the tremor
community ( waves to **Anton Whalley** of [Rust Dublin](https://www.meetup.com/Rust-Dublin/) fame! ).

[Tremor Helm Charts](https://github.com/tremor-rs/tremor-k8s-helm)

## Conclusion

Shortly before tremor was open-sourced and donated to the Linux
Foundation it became cloud-native itself through the combined efforts of
the Infrastructure group at Wayfair - especially our Platform
Engineering, SRE’s and our Kubernetes teams' hard work.  
  
We hope to productize and open source other solution packs that enable
the wider tremor community to quickly bootstrap production environments
based on the tremor-based systems we already have in productioning in
our Logging, Metrics, Observability, Kubernetes and Search teams.  
  
In a large way - the early successes of tremor and our adoption of
cloud-native and cloud-based computing aligned the goals of the tremor
project with those of the Linux Foundation and the Cloud Native Compute
Foundation where tremor is now an early stage sandbox project.  
  
If you’re reading this - and the work and philosophy resonates with your
organization, your people and you believe similar benefits could elevate
your production environments - then please reach out to us in the tremor
community and get involved, join us and help us shape tremor’s future.
